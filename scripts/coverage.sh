#!/bin/bash
# Generate test coverage statistics for Go packages.
# Usage: sh coverage.sh --xml
# 单元测试默认执行: go test -v -covermode=count -coverprofile=.cover/xxx.cover package_name
# 如果 go test 需要额外参数，请设置在环境变量: GO_TEST_ARGS 中，如: export GO_TEST_ARGS=-tags=embed
# 如果需要排除一些包，请设置环境变量 EXCEPT_PKGS 如: export EXCEPT_PKGS="gopkg.in/go-playground" 代码中使用 grep -Ev 排除

set -e

workdir=.cover
profile="coverage.txt"
mode=count
temp_test_file_name="temp_coverage_test.go"
default_except_pkgs="vendor"


dividing(){
    i=0; while [ $i -le 120 ]; do printf "-"; i=$((i+1)); done
    printf "\n"
}

add_temp_test_file_to_dir() {
    for file in `find $1 -name "*.go" | grep -Ev $default_except_pkgs`; do
        pkgname=$(cat $file | grep "^package " | awk 'NR==1{print $2}')
        path=$(dirname "$file")
        echo "package $pkgname" > $path/$temp_test_file_name
    done
}

clean_and_check_exit(){
    find `pwd` -name "*$temp_test_file_name" | xargs rm -rf
    if [ $1 != 0 ]; then
        rm -rf "$workdir"
        dividing
        echo "Have $1 errors, then exit!"
        dividing
        exit 1
    fi
}

generate_cover_data() {
    rm -rf "$workdir"
    mkdir "$workdir"

    add_temp_test_file_to_dir `pwd`

    exit_count=0

    for pkg in "$@"; do
        dividing
        echo $pkg
        f="$workdir/$(echo $pkg | tr / -).cover"
        if !(go test -v $GO_TEST_ARGS -covermode="$mode" -coverprofile="$f" "$pkg"); then
            exit_count=`expr $exit_count + 1`
            echo "GO TEST FAILED $pkg"
        fi
    done

    clean_and_check_exit $exit_count

    echo "mode: $mode" > "$profile"
    if grep -h -v "^mode:" "$workdir"/*.cover >> "$profile"; then
        exit_count=0
    fi

    clean_and_check_exit $exit_count
}

generate_xml_report(){
    dividing
    # go get github.com/axw/gocov/gocov
    # go get github.com/AlekSi/gocov-xml
    echo "convert stout to json|convert json to xml"
    gocov convert "$profile" | gocov-xml > coverage.xml
    echo "done"
}

stats_coverage() {
  printf "\n%-17s Code Coverage Stats\n"
  dividing
  cat coverage.html | grep "^<tr id=\"s_pkg_" | awk -F '[><]' '{printf "%-40s %-10s %-10s \n", $9, $19, $27}'
  dividing
  cat coverage.html | grep "^<tr><td><code>Report Total</code>" | awk -F '["><"]' '{printf "%-40s %-10s %-10s \n", "Report Total", $17, $27}'
}

generate_html_report(){
    dividing
    # go get github.com/axw/gocov/gocov
    # go get gopkg.in/matm/v1/gocov-html
    echo "convert stout to json|convert json to html"
    gocov convert "$profile" | gocov-html > coverage.html
    echo "done"
    dividing
    stats_coverage
}

generate_coverage(){
    echo "except packages:" $default_except_pkgs

    if [ -n "$EXCEPT_PKGS" ]; then
        echo "except packages[extra]:" $EXCEPT_PKGS
        generate_cover_data $(go list ./... | grep -Ev $default_except_pkgs | grep -Ev $EXCEPT_PKGS)
    else
        generate_cover_data $(go list ./... | grep -Ev $default_except_pkgs)
    fi

    for arg in "$@"; do
        case "$arg" in
            "")
               ;;
            --html )
              generate_html_report  ;;
            --xml )
              generate_xml_report  ;;
              *)
            echo >&2 "error:invalid option:$1"; exit 1;;
        esac
    done
}

generate_coverage $@
workflow "Build Project" {
  // TODO need another state
  on = "release"
  resolves = ["deploy"]
}

action "build" {
  uses = "./actions/build"
  args = "linux/amd64"
}

action "deploy" {
    needs = "build"
    uses = "./actions/deploy"
}
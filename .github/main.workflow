workflow "Build Project" {
  // We want to run the workflow on each push
  on = "push"

  // Specify which actions should be triggered
  resolves = ["build"]
}

action "build" {
  // My public action
  uses = "miclle/actions/golang-build@master"

  // Optional args for specific architechtures
  args = "linux/amd64 darwin/amd64"
}

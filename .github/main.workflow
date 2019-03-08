workflow "Build Project" {
  // We want to run the workflow on each push
  on = "push"
  // Specify which actions should be triggered
  resolves = ["deploy"]
}

action "build" {
  // My public action
  uses = "momaek/mdxz/build@master"
  // Optional args for specific architechtures
  args = "linux/amd64 darwin/amd64"
}
  
action "deploy" {
  needs = "build"
  uses = "momaek/mdxz/deploy@master"
}

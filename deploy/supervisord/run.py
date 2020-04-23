#!/usr/bin/python

import os
import sys
from optparse import OptionParser
import traceback
import resource

parser = OptionParser()
parser.add_option("-c", "--command", dest="command", action="store", type="string",
                  help="command", metavar="qboxio -f qboxio.conf")
parser.add_option("-p", "--pid", dest="pid", action="store", type="string",
                  help="pid file", metavar="/path/to/io.pid")
parser.add_option("-t", "--type", dest="rotate_type", action="store", type="string",
                  help="rotate type: time, or size", metavar="size", default="size")
parser.add_option("-r", "--redirect", dest="redirect", action="store", type="string",
                  help="redirect stdin and stdout to pipe", metavar="/path/to/app.log")
parser.add_option("-s", "--stack", dest="stack", action="store", type="int", default=0,
                  help="stack size", metavar="8192")

(options, args) = parser.parse_args()

stdin_fd = os.dup(0)
stdout_fd = os.dup(1)
stderr_fd = os.dup(2)
stderr = os.fdopen(stderr_fd, "w")

try:

  if options.pid:
    file(options.pid, "w").write(str(os.getpid()))


  if options.redirect:
    if options.rotate_type == "size":
      pipe_input, pipe_output = os.popen4(["rotatelogs", "-l", "-f" , options.redirect + "-%m%d%H%M%S", "500M"])
    else:
      pipe_input, pipe_output = os.popen4(["rotatelogs", "-l", "-f" , options.redirect + "-%Y%m%d", "86400"])
    os.dup2(pipe_output.fileno(), 0)
    os.dup2(pipe_input.fileno(), 1)
    os.dup2(pipe_input.fileno(), 2)

  if options.stack != 0:
    resource.setrlimit(resource.RLIMIT_STACK, (options.stack, resource.RLIM_INFINITY))
  args = options.command.split(" ")
  os.execlp(args[0], *args)
except:
  traceback.print_exc(file=stderr)
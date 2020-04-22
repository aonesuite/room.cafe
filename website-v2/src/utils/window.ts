/*
 * Created on Mon Feb 04 2019
 * Copyright (c) 2019 Miclle Zheng <miclle.zheng@gmail.com>
 * Distributed under terms of the MIT license.
 */

// https://developer.mozilla.org/zh-CN/docs/Web/API/Window/open
export function openWindow(url: string, name?: string): Window | null {

  const width =  screen.width * 0.8
  const height = screen.height * 0.8
  const top = (screen.height - height) / 2
  const left = (screen.width - width) / 2

  if (name === undefined || name === "") {
    name = new Date().getTime().toString()
  }

  const features = `
    resizable=yes,
    scrollbars=yes,
    titlebar=yes,
    toolbar=no,
    location=no,
    directories=no,
    status=no,
    menubar=no,
    copyhistory=no,
    width=${width},
    height=${height},
    top=${top},
    left=${left}
  `

  return window.open(url, name, features)
}
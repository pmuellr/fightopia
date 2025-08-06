#!/usr/bin/env node --import ./test/test_ansi.js

import { ansiColor, ANSI_FORE_COLOR, ANSI_BACK_COLOR } from '../lib/styles.js'

export function test() {
  for (let i=0; i<8; i++) {
    const spans = ['']; spans.pop()
    for (let j=0; j<8; j++) {
      const ansiColor = ansiColor([ANSI_FORE_COLOR+i, ANSI_BACK_COLOR+j])
      spans.push(`${ansiColor}${i}/${j}`)
    }
    spans.push(ansiColor([0]))
    console.log(spans.join(' '))
  }

  console.log(`${ansiColor([0])}done`)
}

test()
#! /usr/bin/python

from glob import glob
from subprocess import call
from os.path import splitext, join as pathjoin
from sys import argv


MODULE = 'sweetlib'
DIR = argv[2] if len(argv) > 1 else '.'

for fn, _ in map(splitext, glob(pathjoin(DIR, '*.sjs'))):
    if fn == MODULE: continue
    call(['sjs', '--readable-names','-o', fn+'.js', '--module', pathjoin('.', MODULE+'.sjs'), fn+'.sjs'])

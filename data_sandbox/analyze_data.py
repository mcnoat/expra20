#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Jun 22 07:35:17 2020

@author: user
"""

import pandas as pd

df = pd.read_csv('expra_responses.csv')

print(df['age'].describe())

#%%

import functools

results_file = open('results.txt', 'w')

fprint = functools.partial(print, file=results_file)

fprint(df['age'].describe())

fprint()

#%%

fprint(df['gender'].describe())

results_file.close()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Jun 21 18:55:50 2020

@author: user
"""

import pandas as pd

data_lst = []
dataDir = 'data'
subj_df = pd.DataFrame()
print('subj_df:', subj_df)

#%%

import json
import os

for fileName in os.listdir(dataDir):
    print('fileName \t', fileName)
    if fileName[-3:] == 'csv':
        full_path = os.path.join(dataDir, fileName)
        print('full_path \t', full_path)
        temp_df = pd.read_csv(full_path)
        data_lst.append(temp_df)
        print()

#%%

i = 0
for df in data_lst:
    responses = df['responses'].dropna()
    print('responses: \n', responses)
    print()
    for json_str in responses:
        response_dict = json.loads(json_str)
        for key, value in response_dict.items():
            subj_df.loc[i, key] = value
    i += 1

print('subj_df:', subj_df)

#%%
subj_df = subj_df.sort_index(axis=1)

print('sorted subj_df:', subj_df)

subj_df.to_csv('expra_responses.csv', index=False)

#%%

translate_rosenberg = {'Trifft gar nicht zu': 0,
                       'Trifft eher nicht zu': 1,
                       'Trifft eher zu': 2,
                       'Trifft voll und ganz zu': 3}

for col in subj_df:
    if 'rosenberg' in col:
        question_number = int(col[-2:])
        for row_i in subj_df[col].index:
            # get current value
            text_value = subj_df.loc[row_i, col]
            # set new value
            if question_number in [1, 3, 4, 7, 10]:
                score = translate_rosenberg[text_value]
            else:
                # reversed
                score = 3 - translate_rosenberg[text_value]
                
            subj_df.loc[row_i, col + '_num'] = score
                

subj_df.to_csv('expra_responses.csv', index=False)
'''
Python 2.7
The clustergrammer python module can be installed using pip:
pip install clustergrammer

or by getting the code from the repo:
https://github.com/MaayanLab/clustergrammer-py
'''

from clustergrammer import Network
net = Network()

import numpy as np
import pandas as pd

# generate random matrix
num_rows = 100
num_cols = 1000
np.random.seed(seed=100)
mat = np.random.rand(num_rows, num_cols)

# make row and col labels
rows = range(num_rows)
cols = range(num_cols)
rows = [str(i) for i in rows]
cols = [str(i) for i in cols]

# make dataframe
df = pd.DataFrame(data=mat, columns=cols, index=rows)

# load matrix tsv file
# net.load_file('data/txt/rc_two_cats.txt')
# net.load_file('txt/ccle_example.txt')
# net.load_file('txt/rc_val_cats.txt')
# net.load_file('txt/number_labels.txt')
# net.load_file('txt/mnist.txt')
# net.load_file('txt/tuple_cats.txt')
# net.load_file('txt/example_tsv.txt')

# net.enrichrgram('KEA_2015')

# optional filtering and normalization
##########################################
# net.filter_sum('row', threshold=20)
# net.normalize(axis='col', norm_type='zscore', keep_orig=True)
# net.filter_N_top('row', 3, rank_type='sum')
# net.filter_threshold('row', threshold=3.0, num_occur=4)
# net.swap_nan_for_zero()
# net.set_cat_color('col', 1, 'Category: one', 'blue')

  # net.make_clust()
  # net.dendro_cats('row', 5)

new_rows = [(x, 'Cat-1: A', 'Cat-2: B') for x in df.index]
new_cols = [(x, 'Cat-1: A') for x in df.columns]

new_cols = []
inst_val = -round(df.shape[1]/2)
for inst_col in df.columns.tolist():
  inst_val = inst_val + 1
  new_col = (inst_col, 'Cat: C-' + str(inst_val), 'Val: ' + str(inst_val))
  new_cols.append(new_col)

# new_cols = [(x, 'Cat-1: A', 'Cat-2: B') for x in df.columns]
# new_cols = [(x, 'Cat-1: A', 'Cat-2: B', 'Cat-3: C') for x in df.columns]
df.index = new_rows
df.columns = new_cols

net.load_df(df)

net.cluster(dist_type='cos',views=['N_row_sum', 'N_row_var'] , dendro=True,
               sim_mat=False, filter_sim=0.1, calc_cat_pval=False, enrichrgram=True)

# write jsons for front-end visualizations
net.write_json_to_file('viz', 'data/big_data/custom.json', 'no-indent')
# net.write_json_to_file('sim_row', 'json/mult_view_sim_row.json', 'no-indent')
# net.write_json_to_file('sim_col', 'json/mult_view_sim_col.json', 'no-indent')

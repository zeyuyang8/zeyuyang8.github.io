# Attention

## Introduction

Attention is a mechanism that allows a neural network to focus on certain parts of an input sequence when producing an output sequence.

## Notations

Related to overall objective of attention:

- $\mathbf{X} \in \mathbb{R}^{m \times v}$ -  data.
- $\mathbf{Z} \in \mathbb{R}^{m \times v^{\prime}}$ - transformed data.
- $\mathbf{W} \in \mathbb{R}^{v \times v^{\prime}}$ - attention weights.
- $m$ - number of data points.
- $v$ - number of features in the data points.
- $v^{\prime}$ - number of features after attention transformation on the data points.
- $\varphi$ - non-linear activation function.

Intermediate dependent variables derived from $\mathbf{X}$:

- $\mathbf{Q} \in \mathbb{R}^{m \times q}$ - queries.
- $\mathbf{K} \in \mathbb{R}^{m \times q}$ - keys.
- $\mathbf{V} \in \mathbb{R}^{m \times v}$ - values.
- $\mathbf{W}_q \in \mathbb{R}^{v \times q}$ - query weights.
- $\mathbf{W}_k \in \mathbb{R}^{v \times q}$ - key weights.
- $\mathbf{W}_v \in \mathbb{R}^{v \times v}$ - value weights.
- $q$ - number of features in the queries and keys.

## Mathematical formulation of attention

The attention mechanism can be formulated as follows:

$$
\mathbf{Z}=\varphi(\mathbf{XW}(\mathbf{X}))
$$

where $\varphi$ is a non-linear function. The term $\mathbf{W}(\mathbf{X})$ is weights derived from the data matrix, as attention focuses on certain parts of input sequences.

More generally, we can write:

$$
\mathbf{Z}=\varphi(\mathbf{V W}(\mathbf{Q}, \mathbf{K}))
$$

where $\mathbf{Q}$, $\mathbf{K}$, and $\mathbf{V}$ are queries, keys, and values derived from $\mathbf{X}$, respectively. The queries are used to describe what each input sequence is "asking about", and keys are used to describe what each input sequence contains. The values are used to describe how each input sequence should be transmitted to the output sequence. Queries, keys, and values are usually computed by linear projections of the input sequence $\mathbf{X}$:

$$
\mathbf{Q}=\mathbf{X}\mathbf{W}_q,
\mathbf{K}=\mathbf{X}\mathbf{W}_k,
\mathbf{V}=\mathbf{X}\mathbf{W}_v
$$

When using attention to compute the $i$-th row of $\mathbf{Z}$, denoted by $\boldsymbol{z}_i$, we use its corresoinding query $\boldsymbol{q}_i$ and compare it to each key $\boldsymbol{k}$ in $\mathbf{K}$ to get an array of similarity scores. Then we normalize these similarity scores with softmax function, and make dot product of the resulting array with $\boldsymbol{v}_i$.

$$
\mathbf{z}_i=\sum_{j=1}^{m} \alpha_{i, j} \boldsymbol{v}_j
$$
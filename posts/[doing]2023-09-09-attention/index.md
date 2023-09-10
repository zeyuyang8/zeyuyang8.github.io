# Attention

## Introduction

Attention in machine learning refers to a mechanism that allows models to focus on specific parts of input data.

## Notations

Related to overall objective of attention:

- $\mathbf{X} \in \mathbb{R}^{m \times v}$ -  data.
- $\mathbf{Z} \in \mathbb{R}^{m \times v^{\prime}}$ - transformed data.
- $\mathbf{W} \in \mathbb{R}^{v \times v^{\prime}}$ - attention weights.
- $m$ - number of data points.
- $v$ - number of features in the data points.
- $v^{\prime}$ - number of features after attention transformation on the data points.
- $\varphi$ - non-linear activation function.
- $\sigma$ - softmax function.
- $a$ - similarity function.

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

When using attention to compute one row of $\mathbf{Z}$, denoted by $\boldsymbol{z}$, we first need to use its corresponding query $\boldsymbol{q}$ and compare it to each key $\boldsymbol{k}$ in $\mathbf{K}$ to get an array of similarity scores. Then we normalize these similarity scores with softmax function:

$$
\alpha_i(\boldsymbol{q}, \mathbf{K}) = \sigma_i(a(\boldsymbol{q}, \mathbf{K})) = \sigma_i([a(\boldsymbol{q}, \boldsymbol{k}_1), \ldots, a(\boldsymbol{q}, \boldsymbol{k}_m)])
$$

where $a$ is a similarity function, and $\sigma$ is a softmax function. The similarity function takes vector $\boldsymbol{q}$ and matrix $\mathbf{K}$ as input, and outputs a vector of similarity scores of length $m$, where each element is the similarity score between $\boldsymbol{q}$ and a key in $\mathbf{K}$. The softmax function normalizes the similarity scores to get a probability distribution over all the keys. The $i$-th element of normalized similarty scores, $\alpha_i(\boldsymbol{q}, \mathbf{K})$, is the $i$-th element of the softmax output. Then, we make a weighted sum of the values $\mathbf{V}$ using the normalized scores as weights:

$$
\boldsymbol{z}(
  \boldsymbol{q}, (\boldsymbol{k}_1, \boldsymbol{v}_1),
  \ldots, (\boldsymbol{k}_m, \boldsymbol{v}_m)
) = \sum_{i=1}^m \alpha_i(\boldsymbol{q}, \mathbf{K}) \boldsymbol{v}_i
$$

Assume that queries and keys have the same length $q$, we can compute the similarity scores between queries and keys by dot product. If we assume queries and keys are independent with 0 mean and unit variance, then the mean of the dot product between one key-query pair is 0 and the variance is $q$. To ensure the variance is 1, we can divide the dot product by $\sqrt{q}$. Thus, the similarity score between one query-key pair can be written as:

$$
a(\boldsymbol{q}, \boldsymbol{k}) = \frac{\boldsymbol{q}^T \boldsymbol{k}}{\sqrt{q}} \in \mathbb{R}
$$

When computing attention output with batches of data points, we can write:

$$
\mathbf{Z}(\mathbf{X}) = \mathbf{Z}(\mathbf{Q}, \mathbf{K}, \mathbf{V}) = \sigma(\frac{\mathbf{Q} \mathbf{K}^T}{\sqrt{q}})\mathbf{V}
$$

where the softmax function is applied row-wise.

## Judgmental section - why and why not attention

TBA

## References

1. K. P. Murphy, Probabilistic Machine Learning: An Introduction. MIT press, 2022.
1. K. P. Murphy. Probabilistic machine learning: Advanced topics. MIT press, 2023.

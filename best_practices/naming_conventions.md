## Names with version numbers
### Always use workflow names with standard version numbers.

<workflow name><version number>

#### Bad:

No version number:
<pre>
<i>
DNA PE + seq frag remap + contamination + aggregate
</i>
</pre>

Version numbers do not follow a single standard. Not clear which one is the latest one:
<pre>
<i>
DNA PE + seq frag remap + contamination + aggregate v.0.2.1
DNA PE + seq frag remap + contamination + aggregate v.20180102
</i>
</pre>

Version numbers do not follow a single standard. When sorted by name, they version number may not sort as expected:
<pre>
<i>
DNA PE + seq frag remap + contamination + aggregate v.0.2.0
DNA PE + seq frag remap + contamination + aggregate v0.2.1
DNA PE + seq frag remap + contamination + aggregate v 0.2.2
DNA PE + seq frag remap + contamination + aggregate_v_0_2_3
</i>
</pre>

#### Good:

<pre>
<b>
DNA PE + seq frag remap + contamination + aggregate v.0.2.0
</b>
</pre>



## Version numbering
### Use a single, common version numbering convention.

Use a single version numbering convention that is already commonly used for other software packages (in Galaxy and elsewhere). The workflow names with version numbers should sort from least to most recent ASCIIbetically in any reasoanble tool (UNIX sort, Excel, etc). Version numbers should encode minor and major changes in a commonly used format.

Do not reinvent the wheel. Version numbering is a solved problem. Just use any one of the major conventions, and do not mix them.

#### Good:

<pre>
<b>
v.0.0.1: initial version.
v.0.0.1: next minor change,  such as add 1 tool.
v.0.1.0: next medium change, such as add/remove 3 different tools tools.
v.0.1.1: next minor change,  such as change minor settings of a few tools.
v.0.1.2: next minor change,  such as remove 1 tool.
v.1.0.0: next major change,  such as add new inputs, change aligners, change reference genome.
v.1.0.1: next minor change,  such as upgrade versions of tools without large effects downstream.
</b>
</pre>

#### Bad:

Does not encode granular changes, and does not encode minor/major changes:
<pre>
<i>
v.1
v.2
v.3
</i>
</pre>

Inconsistent: using 2 or 3 numbers, also does not sort from least to most recent versions using other tools such as Excel:
<pre>
<i>
v.0.1
v.0.1.2
v.0.2
</i>
</pre>

Encodes dates (good), but does not encode minor/major changes (bad). Which version is a minor improvement, and which one is a major change? What is `a` and `b` - 2 versions created on the same day? Versions like this is a nasty surprise for someone who writes parsers for these:
<pre>
<i>
v.2018_01_02
v.2018_01_20a
v.2018_01_20b
v.2018_02_13
</i>
</pre>


## Use blanks
### Use blanks in long workflow names for text wrapping.

Use blanks in long workflow names to enable proper text wrapping display within the Galaxy UI Tools panel, Workflows section (on the bottom left). Do not use underscores, dots, commas, or anything else, since such names are not wrapped and hard to read inside the the Galaxy UI Tools panel.

#### Bad:

Underscores or dots do not allow text wrapping:
<pre>
<i>
DNA_PE_seq_frag_remap_contamination_aggregate_v.0.2.0
DNA.PE.seq.frag.remap.contamination.aggregate.v.0.2.0
</i>
</pre>

#### Good:

Blanks allow wrapping:
<pre>
<b>
DNA PE + seq frag remap + contamination + aggregate v.0.2.0
</b>
</pre>


## Workflow functionalities
### Use a single standard delimiter to separate major workflow functionalities.

It is a good practice to create a workflow name that consists of several major workflow functionalities joined together, e.g., `this thing + that thing + another thing`. Use a single standard delimiter, such as ` + ` or `, ` (plus sign or comma) - pick one a stick to it. Note the use of trailing blanks (or leading and trailing blanks) for proper line wrapping.

#### Bad:

Functionalities are mangled together and confusing to anyone but the developer:
<pre>
<i>
DNA PE seq frag remap contamination aggregate v.0.2.0
</i>
</pre>

#### Good:

Functionalities are more clear: this workflow takes DNA paired end reads, uses standard tools, also uses seq frag remap tool, also includes contamination detection, and finally uses aggregate results tool:
<pre>
<b>
DNA PE + seq frag remap + contamination + aggregate v.0.2.0
DNA PE, seq frag remap, contamination, aggregate v.0.2.0
</b>
</pre>

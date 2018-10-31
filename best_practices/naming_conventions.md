### Names and version numbers.
#### Always use workflow names with standard version numbers.

<workflow name><version number>

##### Examples:

###### Bad:

*No version number:*

*DNA PE + seq frag remap + contamination + aggregate*

*Version numbers do not follow a single standard. Not clear which one is the latest one.*

*DNA PE + seq frag remap + contamination + aggregate v.0.2.1, then DNA PE + seq frag remap + contamination + aggregate v.20180102*

*Version numbers do not follow a single standard. When sorted by name, they version number may not sort as expected.*

*DNA PE + seq frag remap + contamination + aggregate v.0.2.0, then DNA PE + seq frag remap + contamination + aggregate v0.2.1, then DNA PE + seq frag remap + contamination + aggregate_v. 0.2.3*

###### Good:

**DNA PE + seq frag remap + contamination + aggregate v.0.2.0**


### Version numbering convention.
#### Use a single commonly used version numbering convention.

Examples:

Bad:

Does not allow granular changes, and does not encode minor/major changes.
v.1, then v.2

Inconsistent: using 2 or 3 numbers, also does not sort from most to least recent versions using other tools wuch as Excel.
v.0.1, then v.0.1.2, then v.0.2

Encodes dates, but does not encode minor/major changes.
v.2018_01_02, then v.2018_01_20, then v.2018_02_13


Good:

v.0.0.1: initial version
v.0.0.1 - next small change, such as add 1 tool.
v.0.1.0 - next medium change, such as add/remove many tools
v.0.1.1 - next small change, such as change minor settings.
v.0.1.2 - next small change, such as remove 1 tool.
v.1.0.0 - next major change, such as add new inputs, change aligners, change reference genome.
v.1.0.1 - next small change, such as remove 1 tool.
...

### Workflow functionalities.
#### Use a single standard delimiter, such as "+" in workflow names to show major workflow functionalities.

Examples:

Bad:

Functionalities are mangled together and not clear.
DNA PE seq frag remap contamination aggregate v.0.2.0 

Good:

Functionalities are more clear: this workflow takes DNA paired end reads, uses standard tools, also uses seq frag remap tool, also includes contamination detection, and finally uses aggregate results tool.
DNA PE + seq frag remap + contamination + aggregate v.0.2.0

### Blanks.
#### Avoid long workflow names without blanks, to enable proper text wrapping display using Galaxy UI Tools panel, Workflows section (on the bottom left).

Examples:

Bad:

Underscores do not allow text wrapping.
DNA_PE_seq_frag_remap_contamination_aggregate_v.0.2.0

Dots do not allow text wrapping.
DNA.PE.seq.frag.remap.contamination.aggregate.v.0.2.0

Good:

Blanks allow wrapping.
DNA PE + seq frag remap + contamination + aggregate v.0.2.0

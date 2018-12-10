# NAMING CONVENTIONS

*"There are only two hard things in Computer Science: cache invalidation and naming things"*

\-- Phil Karlton

## Names with version numbers
### Always use workflow names with standard version numbers.

<workflow name><version number>

#### Good:

<pre>
<b>
DNA PE + seq frag remap + contamination + aggregate v.0.2.0
DNA PE + seq frag remap + contamination + aggregate v.1.4.13
</b>
</pre>

#### Bad:

No version number:
<pre>
<i>
DNA PE + seq frag remap + contamination + aggregate
</i>
</pre>

User name is *not* a version number. Such names just show the origin of the workflow (shared by user such and such). These names are common because they are Galaxy default names created when workflows are copied.

Switching from user names to user initials could make it worse, because JS can be either Jane Smith or James Smythe, or a workflow for processing data from JS-2100 new model instrument, and now your colleagues may be really confused. And also, which one is the most recent workflow: JS or JD?
<pre>
<i>
DNA PE + seq frag remap + contamination + aggregate shared by John Doe shared by Jane Smith
DNA PE + seq frag remap + contamination + aggregate JD JS
DNA PE + seq frag remap + contamination + aggregate JS
DNA PE + seq frag remap + contamination + aggregate JD
</i>
</pre>



## Version numbering
### Use a single, common version numbering convention.

Use a single version numbering convention that is already commonly used for other software packages (in Galaxy and elsewhere). The workflow names with version numbers should sort from least to most recent ASCIIbetically in other common tools outside Galaxy (UNIX sort, Excel, etc). Version numbers should encode small and big changes in a commonly used, easy to understand format.

Do not reinvent the wheel. Version numbering is a *solved problem*. Just use any one of the major conventions, and do not mix them up. Here is a good one: 3 integers separated by dots, like so: `1.20.3` (`major.minor.micro`, or `major.minor.patch`, or `version.release.modification`), which follows [Best Practices for Creating Galaxy Tools](https://galaxy-iuc-standards.readthedocs.io/en/latest/best_practices/tool_xml.html#tool-versions), which in turn follows the Python [PEP 440 specification](https://www.python.org/dev/peps/pep-0440/).

#### Good:

<pre>
<b>
v.0.0.1: initial version.
v.0.0.1: next micro change,  such as add 1 tool.
v.0.1.0: next minor change, such as add/remove 3 different tools tools.
v.0.1.1: next micro change,  such as a change in settings of a few tools with small effects downstream.
v.0.1.2: next micro change,  such as remove 1 tool.
v.1.0.0: next major change,  such as add new inputs, change aligners, change reference genome.
v.1.0.1: next micro change,  such as upgrade versions of tools without large effects downstream.
</b>
</pre>

#### Bad:

Version numbers do not follow a single standard. Not clear which one is the latest one:
<pre>
<i>
DNA PE + seq frag remap + contamination + aggregate v.0.2.1
DNA PE + seq frag remap + contamination + aggregate v.20180102
</i>
</pre>

It seems like here version numbers follow a single standard (almost). But they do not! This is a *mess*. When sorted by name, the version numbers may not sort as expected. Worse, the developer always has to think what is the standard, anyhow?

Pick a single standard, and follow it. If you pick somthing like this: `v.1.23.0`, be consistent. Always use `v`, `.`, then integers and dots, no blanks, underscores, or letters:
<pre>
<i>
DNA PE + seq frag remap + contamination + aggregate v.0.2.0
DNA PE + seq frag remap + contamination + aggregate v0.2.1
DNA PE + seq frag remap + contamination + aggregate v.0.2.2a
DNA PE + seq frag remap + contamination + aggregate v.0.2.2b
DNA PE + seq frag remap + contamination + aggregate v.0.2.2c
DNA PE + seq frag remap + contamination + aggregate version 0.3.1
DNA PE + seq frag remap + contamination + aggregate v0.4.1
DNA PE + seq frag remap + contamination + aggregate v 0.4.2
DNA PE + seq frag remap + contamination + aggregate_v_0_4_3
</i>
</pre>

Five integers is way too much granularity, at least when exposed to users who are not software developers. This is a Galaxy workflow, not a Linux kernel. Some users remember the version numbers by heart (true story), so give them this opportunity by keeping it short and sweet. If you need extra granularity, at least hide it from the users:
<pre>
<b>
v.1.0.2.34.335
v.1.0.2.34.336
</b>
</pre>

A single integer is too little granularity. It does not encode big vs. small changes:
<pre>
<i>
v.1
v.2
v.3
</i>
</pre>

Inconsistent: not clear if developers and maintaniers should use 2 or 3 numbers to encode the version. Also such numbers are harder to parse automatically or sort in other tools outside Galaxy:
<pre>
<i>
v.0.1
v.0.1.2
v.0.2
</i>
</pre>

Encodes dates (good idea in principle, but not always good in practice). But does not encode big vs. small changes (really bad). Which version results in a small improvement, and which one has big effects? Also, what is `a` and `b`? Are these 2 versions created on the same day? Which one has bigger effects? Because `a` and `b` after a date is not always a common practice, version conventions like this can present a nasty surprise for someone later who writes parsers for version names. A good parser will fail, while a bad parser will drop the extra `a` and `b`, and mangle the 2 versions into 1, with unpredictable downstream effects:
<pre>
<i>
v.2018_01_02
v.2018_01_20a
v.2018_01_20b
v.2018_02_13
</i>
</pre>


## Use separators in long names
### Use separators  (currently, blanks) between parts of long workflow names.

Use separators for legibility and for text wrapping. Currently, use blanks, and, when Galaxy UI supports text wrapping on those, use underscores and dots.

Use blanks in long workflow names to enable proper text wrapping display within the Galaxy UI Tools panel, Workflows section (on the bottom left). Text wrapping is essential to easily view long Galaxy workflow names. As of this writing (December, 2018), Galaxy web UI does not support proper text wrapping on non-blank delimiters. Thus, for now do not use underscores, dots, commas, or anything other than blanks.


#### Good:

Blanks allow text wrapping:
<pre>
<b>
DNA PE + seq frag remap + contamination + aggregate v.0.2.0
</b>
</pre>


#### Bad:

No separators make sit very hard:
<pre>
<i>
DNAPEseqfragremapcontaminationaggregatev020
</i>
</pre>

CamelCase is easier to read than no separators at all, but harder to read than other separators. Plus, CamelCase also does not allow text wrapping:
<pre>
<i>
DNAPESeqFragRemapContaminationAggregatev.0.2.0
</i>
</pre>

Underscores or dots are easy to read and also compatible with other languages. But currently the do not allow text wrapping in Galaxy UI:
<pre>
<i>
DNA_PE_seq_frag_remap_contamination_aggregate_v.0.2.0
DNA.PE.seq.frag.remap.contamination.aggregate.v.0.2.0
</i>
</pre>


NOTE: When when Galaxy UI supports text wrapping on those, use underscores and dots, rather than blanks. The reason for this is that the majority of the best coding practices for programming languages (including Python and other languages used in Galaxy core and tool development) call for names *without blanks*. It helps to enable the Galaxy workflow names to be used if needed as the names of files, directories, variables, methods, classes, tables, columns, etc (almost) "as is", with minimal or no changes. For example, `seq_frag_v_0_2_0` will work as a valid name for variables, columns, etc in many programmming languages, such as Python, bash or SQL, but `seq frag v_0_2_0` and `seq_frag.v.0.2.0` will not always work.

## Workflow functionalities
### Use a single standard delimiter to separate major workflow functionalities.

It is a good practice to create a workflow name that consists of several major workflow functionalities joined together, e.g., `do this thing + do that thing + do one more thing`. Use a single standard delimiter, such as ` + ` or `, ` (plus sign or comma). As always, pick one delimiter and stick to it. Note the use of trailing blanks (or leading and trailing blanks) for the delimiters for proper line wrapping, for consistency with other programming languages and also with plain English punctuation.

#### Good:

Functionalities are more clear: this workflow takes DNA paired end reads, uses standard tools, also uses seq frag remap tool, also includes contamination detection, and finally uses aggregate results tool:
<pre>
<b>
DNA PE + seq frag remap + contamination + aggregate v.0.2.0
DNA PE, seq frag remap, contamination, aggregate v.0.2.0
</b>
</pre>

#### Bad:

Functionalities are mangled together and confusing to anyone but the developer:
<pre>
<i>
DNA PE seq frag remap contamination aggregate v.0.2.0
</i>
</pre>

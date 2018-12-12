# Naming Conventions

*"There are only two hard things in Computer Science: cache invalidation and naming things"*

\-- Phil Karlton

## Names with version numbers
### Use workflow names with version numbers.

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
v.0.0.1: next micro change, such as add 1 tool with no substantial effects on
                the final results.
v.0.1.0: next minor change, such as add/remove 2-4 different tools with small
                but substantial effects on the results.
v.0.1.1: next micro change, such as a change in settings of a few tools with
                no substantial effects downstream, small bug fixes.
v.0.1.2: next micro change, such as remove 1 tool, add workflow documentation.
v.1.0.0: next major change, such as add new inputs, which may have very
                substantial effects on the UI or the results.
v.1.0.1: next micro change, such as upgrade versions of tools without
                substantial effects downstream.
v.2.0.0: next major change, such as change aligners, or major change in the
                aligner versions, which may have substantial effects on the results.
v.3.0.0: next major change, such as change the reference genome, or change
                the aligner settings from default to very sensitive, or
                change variant caller settings from min allele frequency
                0.2 to 0.02, which may have very substantial effects of the
                results.
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

It seems like here version numbers follow a single standard (almost). But they do not! This is a *mess*. When sorted by name, the version numbers may not sort as expected. Worse, the developer always has to guess about what is the standard?

Pick a single standard, and follow it. If you pick something like this: `v.1.23.0`, be consistent. Always use `v`, `.`, then integers and dots, no blanks, underscores, or letters:
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

Five integers is way too much granularity, at least when exposed to users who are not software developers. This is a Galaxy workflow, not a Linux kernel. Some users remember the version numbers by heart (true story), so give them this opportunity by keeping it short and sweet. If you need extra granularity, keep it in developer-only versions, and hide it from the users:
<pre>
<i>
v.1.0.2.34.335
v.1.0.2.34.336
</i>
</pre>

A single integer is too little granularity. It does not encode big vs. small changes:
<pre>
<i>
v.1
v.2
v.3
</i>
</pre>

This is inconsistent. It is not clear if developers and maintainers should use 2 or 3 numbers to encode the version. Also such numbers are harder to parse automatically or sort in other tools outside Galaxy:
<pre>
<i>
v.0.1
v.0.1.2
v.0.2
v.0.2.1
v.0.2.2
</i>
</pre>

Examples below encode dates (good idea in principle, but not always good in practice). It does not encode big vs. small changes (bad). Which version results in a small improvement, and which one has big effects? Also, what is `a` and `b`? Are these 2 versions created on the same day? (Note: using `a` and `b` like so is often an afterthought for such version numbering by date, while other even worse afterthoughts include adding datestamps, which makes version numbers almost impossible to remember for users.) Which one has bigger effects? Because `a` and `b` after a date is not always a common practice, version conventions like this can present a nasty surprise for someone later who writes  code to parse version numbers. For example, one can decide to store version numbers and workflow descriptions. A programmer who has seen only the first two examples (v.2018_01_01, v.2018_01_02, without `a` and `b`), will not read your thoughts and code also parsing `a` and `b` at the end of the date. The resulting parser, if it is good, should fail (bad). Meanwhile, a poor parser will drop the extra `a` and `b`, then mangle the multiple versions into one, and proceed merrily with unpredictable downstream effects:
<pre>
<i>
v.2018_01_01
v.2018_01_02
v.2018_01_20a
v.2018_01_20b
v.2018_02_13
</i>
</pre>


## Separators in long names
### Use separators (currently, blanks) between parts of long workflow names.

Use separators for legibility and for text wrapping of long workflow names within the Galaxy UI Tools panel, Workflows section (on the bottom left). Text wrapping is essential to easily view long Galaxy workflow names.

Currently, use blanks. As of this writing (12/11/2018), Galaxy web UI does not support proper text wrapping on non-blank separators.  But when Galaxy web UI supports text wrapping on underscores and dots, use those, rather than blanks.

#### Good:

Blanks allow text wrapping:
<pre>
<b>
DNA PE + seq frag remap + contamination + aggregate v.0.2.0
</b>
</pre>


#### Bad:

No separators makes it very hard to read:
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
### Use a single standard delimiter, such as +, to separate major workflow functionalities.

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

Delimiters are inconsistent without any compelling reason:
<pre>
<i>
DNA (PE) + seq frag remap + contamination + aggregate v.0.2.0
DNA_PE_seq_frag_remap, contamination + aggregate v.0.2.0
</i>
</pre>

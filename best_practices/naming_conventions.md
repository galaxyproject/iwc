# Naming Conventions

*"There are only two hard things in Computer Science: cache invalidation and naming things"*

\-- Phil Karlton

## Workflow names and version numbers
### Use a simple convention for workflow names and version numbers.

For example, for next generation sequencing data analysis, the names should be:

`<library prep method>, <analysis method>, <genome>, vYYYYMMDD.V`, where the parts (delimited by comma with blank) are:

`<library prep method>` = a short description of the library prep method, e.g., "DNA", "RNA", "EM-seq", "low input RNA",

`<analysis method>` = "std" or any unusual complexity about this method e.g. "2-stage mapping", or key steps delimited by ` + `,

`<genome>` = short genome name, e.g., "GRCh38+mC controls", "GENCODE v29",

`<version>` = date followed by point release / minor version number (e.g. "20190715.0", "20190715.1").

#### Good:

<pre>
<b>
DNA, seq frag remap + contamination + aggregate, hg19, v20190715.0
</b>
</pre>


#### Bad:

Missing critical parts, inconsistent order, inconsistent delimiters:
<pre>
<i>
seq frag remap + contamination + aggregate, hg19, v20190715.0
hg19 DNA, seq frag remap + contamination + aggregate, v20190715.0
DNA - seq frag remap + contamination + aggregate; hg19 - v20190715.0
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
DNA, seq frag remap + contamination + aggregate, hg19, v20190125.0
</b>
</pre>


#### Bad:

No separators makes it very hard to read:
<pre>
<i>
DNAPEseqfragremapcontaminationaggregatev201901250
</i>
</pre>

CamelCase is easier to read than no separators at all, but harder to read than other separators. Plus, CamelCase also does not allow text wrapping:
<pre>
<i>
DNAPESeqFragRemapContaminationAggregatev20190125.0
</i>
</pre>

Underscores or dots are easy to read and also compatible with other languages. But currently the do not allow text wrapping in Galaxy UI:
<pre>
<i>
DNA_PE_seq_frag_remap_contamination_aggregate_v20190125.0
DNA.PE.seq.frag.remap.contamination.aggregate.v20190125.0
</i>
</pre>


NOTE: When Galaxy UI supports text wrapping on those, use underscores and dots, rather than blanks, for compatibility with programming languages.

## Workflow functionalities
### Use a standard delimiters (" + " or ", ") to separate major workflow functionalities.

It is a good practice to create a workflow name that has analysis method that consists of several major workflow functionalities joined together, e.g., `do this thing + do that thing + do one more thing`. Use standard delimiters, such as ` + ` or `, ` (plus sign or comma). Note the use of a trailing blank after comma and leading and trailing blank ariund the plus sign for proper line wrapping. This is consistent with English language and programming languages conventions.

#### Good:

Functionalities are more clear: this workflow takes DNA reads, uses seq frag remap tool, also includes contamination detection, and finally uses aggregate results tool:
<pre>
<b>
DNA, seq frag remap + contamination + aggregate, hg19, v20190715.0
</b>
</pre>

#### Bad:

Functionalities are mangled together and confusing to anyone but the developer:
<pre>
<i>
DNA seq frag remap contamination aggregate v20190715.0
</i>
</pre>

Delimiters are inconsistent without any compelling reason:
<pre>
<i>
DNA + seq frag remap + contamination_aggregate_v20190715.0
DNA_PE_seq_frag_remap, contamination + aggregate v20190715.0
</i>
</pre>

## Tags
### Use tags in addition to workflow names.

Use tags to group and find workflows. For tags, always use lower case for compound word separation. Required tags should include at least:

- "production" - if this workflow is used in production,
- input type, e.g., "dna", "rna", "small-rna",
- instrument type, e.g., "illumina", "nanopore", "pacbio"


## Names with version numbers
### Always use version numbers in addition to workflow names.

All things are impermanent. Assume that all workflows will need to change, too. This includes trivial workflows made of one or two tools.

<workflow name><version number>

#### Good:

<pre>
<b>
DNA, seq frag remap  + aggregate, hg19, v20190720.0
DNA, seq frag remap  + aggregate, hg19, v20190720.1
</b>
</pre>

#### Bad:

No version number:
<pre>
<i>
DNA, seq frag remap  + aggregate, hg19
</i>
</pre>

User names typically do not belong to workflow names, and should not be used as version numbers:
<pre>
<i>
DNA PE + seq frag remap + contamination + aggregate shared by John Doe shared by Jane Smith
DNA PE + seq frag remap + contamination + aggregate JD JS
DNA PE + seq frag remap + contamination + aggregate JS
DNA PE + seq frag remap + contamination + aggregate JD
</i>
</pre>

Such names just show the origin of the workflow (user X either wrote the workflow or just shared it). These names are common mostly because they are Galaxy default names created when workflows are copied.

Switching from user names to user initials could make such "versioning" even worse, because JS can be either a workflow shared by Jane Smith or Jack Sack, or a workflow for processing data from JS-1000 sequencer, and now your colleagues are really confused. Also, which one is the most recent workflow: JS or JD?


## Version numbering
### Use a single, common version numbering convention.

Use a single version numbering convention that is already commonly used for other software packages. Workflow names with version numbers should sort from the least to the most recent ASCIIbetically in other common tools outside of Galaxy (UNIX sort, Excel, etc). 

A good convention to write workflow name and version is like this: `workflow name, vYYYYMMDD.V` , where:

`workflow name` is the name of the workflow (major workflow changes are encoded here),

`vYYYYMMDD.V` - version string, which encodes minor changes,

`v` is the prefix (short for `version`),

`YYYYMMDD` is the release date,

`V` is the version number for that release date, starting with 0.

Use Galaxy auto-generated version, displayed in Workflow | Edit, such as Version 0, Version 1, etc, to encode micro changes. It does not correspond to `V`, and the developer cannot control is explicitly - Galaxy increments it automatically.

#### Good:

<pre>
<b>
workflow name and version = DNA, seq frag remap  + aggregate, hg19, v20190720.0
Galaxy auto-generated version = Version 0
meaning = initial version, written July 20th, 2019.

workflow name and version = DNA, seq frag remap  + aggregate, hg19, v20190720.0
Galaxy auto-generated version = Version 1
meaning = next micro change, done on the same day, such as add/remove a tool
with no substantial effects on the final results, or change documentation,
or fix a bug.

workflow name and version = DNA, seq frag remap  + aggregate, hg19, v20190720.1
Galaxy auto-generated version = Version 0
meaning = next minor change on the same date, such as add/remove one or more 
tools, or fix one or more bugs with small but substantial effects on the final
results.

workflow name and version = DNA, seq frag remap  + aggregate, hg19, v20190723.0
Galaxy auto-generated version = Version 0
meaning = next minor change, done on a different date.


workflow name and version = DNA, no dups + seq frag remap  + aggregate, GRCh38, v20190723.0
Galaxy auto-generated version = Version 0
meaning = next major change, such as add new inputs, change reference genome,
major change in tool settings (e.g., change from keeping to discarding
duplicate reads). The change may have large and substantial effects on the UI
or the results. This is encoded in a different workflow name.
   
</b>
</pre>

Other commonly used versioning conventions include semantic versioning (`major.minor.micro`, such as `2.3.0`), and mixed semantic/date versioning (such as `2.3.0.20190720`). However, we prefer the convention above. It is flexible, clearly shows how recent the version is, and the version numbers are relatively short.

Whatever versioning convention you choose, make sure it makes sense for your team, and try to be reasonably consistent.

#### Bad:

Version numbers do not follow a single standard. Not clear which one is the latest one:
<pre>
<i>
DNA, seq frag remap + contamination + aggregate, hg19, v.0.2.1
DNA, seq frag remap + contamination + aggregate, hg19, v.20180102
</i>
</pre>

It may seem like the version numbers here follow a single standard, but they really do not:

<pre>
<i>
DNA, seq frag remap + contamination + aggregate, hg19, v20190723.0
DNA, seq frag remap + contamination + aggregate, hg19, v.20190723.1
DNA, seq frag remap + contamination + aggregate, hg19, v_20190723_2
DNA, seq frag remap + contamination + aggregate, hg19, version 20190723.3
DNA, seq frag remap + contamination + aggregate, hg19, v20190723a
DNA, seq frag remap + contamination + aggregate, hg19, v20190723b
DNA, seq frag remap + contamination + aggregate, hg19, v20190723.0.2
</i>
</pre>

Instead, the above versions are a mess. When sorted ASCIIbetically, the version numbers may not sort as expected. Worse, the developer always has to guess the naming convention.

Pick a single standard convention, and follow it. Be consistent. In our convention, always use `v`, then date, dot, integer - no blanks, underscores, or letters.

A version that has a date and 3 numbers offers way too much granularity, at least when exposed to users who are not software developers:

<pre>
<i>
DNA, seq frag remap + contamination + aggregate, hg19, v20190723.0.34.335
DNA, seq frag remap + contamination + aggregate, hg19, v20190723.0.34.336
</i>
</pre>

This is just a Galaxy workflow, not a Linux kernel. Some users remember the version numbers by heart (true story), so give them this opportunity by keeping it short and sweet.

A single date has too little granularity. Actively developed workflows can change a few times per day, so versioning should allow this:

<pre>
<i>
DNA, seq frag remap + contamination + aggregate, hg19, v20190723
DNA, seq frag remap + contamination + aggregate, hg19, v20190724
</i>
</pre>

Always use a number after the date, even if you think you have a one-off workflow (these workflows often live surprisingly long and require many versions). Having a number for some, but not all, workflows brings unwanted surprises both for humans who try to guess the rules, and for the version parsing code that humans write:

<pre>
<i>
workflow name and version = DNA, seq frag remap  + aggregate, hg19, v20190720
workflow name and version = DNA, seq frag remap  + aggregate, hg19, v20190720.2
</i>
</pre>

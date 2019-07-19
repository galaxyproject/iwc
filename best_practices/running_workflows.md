# Running workflows

*"I ran your workflow, but it does not work"*

\-- Anonymous

## Record-keeping
### Keep records of the workflows, inputs and parameters.

Make your analysis reproducible by keeping records of what, when and how you did the analysis. This simplifies debugging if you workflow fails, enables you to analyze consistently different datasets across time or experimental conditions. It will be really handy when publishing or sharing results with colleagues.

Treat analysis as you would treat your experiments, and keep records.

#### Good:

Record in a plain text file or your electronic lab notebook the date and the details of the workflow that you ran. Make it enough for you to reproduce the analysis in half a year if you need it. If you analyze the data in a collaboration, make the records good enough for other to reproduce the analysis. A good example is below.

Our workflows usually end in a tool that aggregates the results of different workflow steps, such as BWA mapping, Picard GC bias, Picard MarkDuplcicates, etc,, and stores them in a relational database for subsequent analysis. The aggregate results tool has a free-text input field called "Notes". I use it to copy and paste the chunk of text below, so that every sample/library has metadata attached to it about how the results were obtained. This is in addition and on top of the metadata recorded automatically and manually in other structured numeric and text fields. 

<pre>
<b>

01/03/19;

history = ts_dat_190103_3.wkf_scrna_v13.nre_1e6

reference history = ts_dat_190103_2.fl_tr_hp_2_18.refs

workflow = SC_RNASeq_v13

downsampled reads (integer number or fraction between 0 and 1) = 1e6

read 1 fastq:
test_input_reads_1.fastq

read 2 fastq
test_input_reads_2.fastq

known rRNA = Whole_45S_rRNA_subunits_and_ITS_and_Whole_MtDNA.fasta

GTF = hg19_genes.gtf

gene model (bed) = hg19_genes.bed

rRNA intervals = encode_and_RM_rRNA.merged.interval

transcripts refflat = hg19_genes.refflat

transcripts fasta for per transcript coverages = gencode.v25.ERCC92.fasta

transcripts gff for per transcript coverages = Su_UHR_1243_v2.gff3

human transcripts (fasta) = gencode.v25.ERCC92.fasta
(same as above)

###

trim resync:

read 1:

5 prime trim file = adapters.tso.atg3_4.t30.full_g3_pcr.fasta

3 prime trim file = adapters.ilmn.fasta

read 2:
(same as read 1)

5 prime trim file = adapters.tso.atg3_4.t30.full_g3_pcr.fasta

3 prime trim file = adapters.ilmn.fasta

###

aggregate results:

project = ts_dat_190103_3.wkf_scrna_v13.nre_1e6

</b>
</pre>

#### Bad:

Recording absolutely nothing is surprisingly frequent, and can bite
you the most later.

Omitting important info that is hard to find in the Galaxy history is the next worst thing. Especially if the history is deleted later due to disk space limitations.

Typically, the important info, from most to least, is:

- Workflow name
- Workflow version
- Input data sets and their sources
- Parameter settings, especially those rarely changed from defaults
- And lots of surprising things, in case you delete the history

## Running different workflow versions
### Check the workflow version before running it.

Make sure you are running the correct workflow version. Usually, this is the latest one.

#### Good:

**Search the Workflows tab for the name of the workflow and find the one you need.** Use the browser Edit | Search (ctrl-f on Windows, or cmd-f on Mac), otherwise [search for workflow] search box. The latest version usually appears on top. Note that in the Workflows tab, the workflows are sorted first by owner (owned by you are on top, followed by owned by others and shared with you), then by modification time (most recent first).

- An older version was recently modified on purpose or by chance, but the modifications are not relevant to your purpose. This older version will appear on top of the most recent version, which you need, and this can be confusing.
- You copied an older version of the workflow. Meanwhile, a more recent version was shared by others with you. But because you did not copy that most recent version, it is owned by others, so it will not sort on top of your older version owned by you. It may be hidden way down the page. Again, very confusing.

#### Bad:

- You did not search for the latest version.
- You did not even remember that different versions exist.

## Keeping workflow versions
### Follow sensible conventions on keeping multiple workflow versions.

Developers should keep most of the workflow versions for record-keeping.

Conventions for the users differ by user, project and work type.

When updating the workflow, recommend that the users delete the old workflow versions to avoid possible confusion. The exceptions include:

- Keeping old copies for record-keeping.
- Cases when users copied an old version and changed it (added/removed tools and parameters) and are planning to develop and update it on tehir own.

Developers should typically unshare and/or remove from Shared Data | Workflows tab the old workflow versions that are owned by them. But the copies the users made themselves are owned by the users (see Owner column under Workflows tab) and are under their control.

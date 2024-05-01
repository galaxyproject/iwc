## ChIP-seq PE:

set.seed(1)
peak.width <- 100
frag.length <- 300
read.length <- 40
gauss.centers <- c(74670000, 74668000, 74666000)
reads.per.peaks <- c(100, 50, 150)
inputs.df <- data.frame(gauss.center = gauss.centers, reads.per.peak = reads.per.peaks)

rand.center <- do.call(c, apply(inputs.df, 1, function(v){
  rnorm(n = v["reads.per.peak"], mean = v["gauss.center"], sd = peak.width)
}))
rand.frag.length <- rnorm(n = sum(reads.per.peaks), mean = frag.length, sd = frag.length / 4)

frag <- data.frame(start = as.integer(rand.center - rand.frag.length / 2),
                   end = as.integer(rand.center + rand.frag.length / 2))
frag$start1 <- frag$start
frag$end1 <- frag$start + read.length
frag$start2 <- frag$end - read.length
frag$end2 <- frag$end

frag$end1[frag$end1 > frag$frag$end] <- frag$end[frag$end1 > frag$frag$end] - 1
frag$start2[frag$start2 < frag$frag$start] <- frag$start[frag$start2 < frag$frag$start] + 1

frag$chr <- "chr2"
frag$name <- paste0("read", 1:nrow(frag))
frag$plus <- "+"
frag$minus <- "-"
frag$score <- 0
write.table(frag[, c("chr", "start1", "end1", "name", "score", "plus")],
            file = "/tmp/sample1_R1.bed",
            sep = "\t", col.names = F, row.names = F, quote = F)
write.table(frag[, c("chr", "start2", "end2", "name", "score", "minus")],
            file = "/tmp/sample1_R2.bed",
            sep = "\t", col.names = F, row.names = F, quote = F)
set.seed(2)
peak.width <- 100
frag.length <- 350
read.length <- 40
# gauss.centers <- c(74670000, 74668000, 74666000)
gauss.centers <- c(74670050, 74668300, 74665000)
reads.per.peaks <- c(1000, 3000, 1000)
inputs.df <- data.frame(gauss.center = gauss.centers, reads.per.peak = reads.per.peaks)

rand.center <- do.call(c, apply(inputs.df, 1, function(v){
  rnorm(n = v["reads.per.peak"], mean = v["gauss.center"], sd = peak.width)
}))
rand.frag.length <- rnorm(n = sum(reads.per.peaks), mean = frag.length, sd = frag.length / 4)

frag <- data.frame(start = as.integer(rand.center - rand.frag.length / 2),
                   end = as.integer(rand.center + rand.frag.length / 2))
frag$start1 <- frag$start
frag$end1 <- frag$start + read.length
frag$start2 <- frag$end - read.length
frag$end2 <- frag$end

frag$end1[frag$end1 > frag$frag$end] <- frag$end[frag$end1 > frag$frag$end] - 1
frag$start2[frag$start2 < frag$frag$start] <- frag$start[frag$start2 < frag$frag$start] + 1

frag$chr <- "chr2"
frag$name <- paste0("read", 1:nrow(frag))
frag$plus <- "+"
frag$minus <- "-"
frag$score <- 0
write.table(frag[, c("chr", "start1", "end1", "name", "score", "plus")],
            file = "/tmp/sample2_R1.bed",
            sep = "\t", col.names = F, row.names = F, quote = F)
write.table(frag[, c("chr", "start2", "end2", "name", "score", "minus")],
            file = "/tmp/sample2_R2.bed",
            sep = "\t", col.names = F, row.names = F, quote = F)
set.seed(3)
peak.width <- 100
frag.length <- 350
read.length <- 40
# gauss.centers <- c(74670000, 74668000, 74666000)
# gauss.centers <- c(74670050, 74668300, 74665000)
gauss.centers <- c(74670100, 74667950, 74665050)
reads.per.peaks <- c(200, 100, 600)
inputs.df <- data.frame(gauss.center = gauss.centers, reads.per.peak = reads.per.peaks)

rand.center <- do.call(c, apply(inputs.df, 1, function(v){
  rnorm(n = v["reads.per.peak"], mean = v["gauss.center"], sd = peak.width)
}))
rand.frag.length <- rnorm(n = sum(reads.per.peaks), mean = frag.length, sd = frag.length / 4)

frag <- data.frame(start = as.integer(rand.center - rand.frag.length / 2),
                   end = as.integer(rand.center + rand.frag.length / 2))
frag$start1 <- frag$start
frag$end1 <- frag$start + read.length
frag$start2 <- frag$end - read.length
frag$end2 <- frag$end

frag$end1[frag$end1 > frag$frag$end] <- frag$end[frag$end1 > frag$frag$end] - 1
frag$start2[frag$start2 < frag$frag$start] <- frag$start[frag$start2 < frag$frag$start] + 1

frag$chr <- "chr2"
frag$name <- paste0("read", 1:nrow(frag))
frag$plus <- "+"
frag$minus <- "-"
frag$score <- 0
write.table(frag[, c("chr", "start1", "end1", "name", "score", "plus")],
            file = "/tmp/sample3_R1.bed",
            sep = "\t", col.names = F, row.names = F, quote = F)
write.table(frag[, c("chr", "start2", "end2", "name", "score", "minus")],
            file = "/tmp/sample3_R2.bed",
            sep = "\t", col.names = F, row.names = F, quote = F)

# Then in bash
# for sample in 1 2 3; do for i in 1 2; do bedtools getfasta -nameOnly -s -fi ~/igv/genomes/seq/mm10.fa -bed sample${sample}_R${i}.bed | seqtk seq -F 'A' - > sample${sample}_R${i}.fastq; done; done
# Then in galaxy bowtie2 on mm10

# For ATAC/CUT&RUN
# Just BAM to BED (even if it is not really a good way to do it)

## ChIP-seq SR
set.seed(1)
peak.width <- 100
frag.length <- 300
read.length <- 40
gauss.centers <- c(74670000, 74668000, 74666000)
reads.per.peaks <- c(100, 50, 150)
inputs.df <- data.frame(gauss.center = gauss.centers, reads.per.peak = reads.per.peaks)

rand.center <- do.call(c, apply(inputs.df, 1, function(v){
  rnorm(n = v["reads.per.peak"], mean = v["gauss.center"], sd = peak.width)
}))
rand.frag.length <- rnorm(n = sum(reads.per.peaks), mean = frag.length, sd = frag.length / 4)

frag <- data.frame(start = as.integer(rand.center - rand.frag.length / 2),
                   end = as.integer(rand.center + rand.frag.length / 2))
frag$start1 <- frag$start
frag$end1 <- frag$start + read.length
frag$start2 <- frag$end - read.length
frag$end2 <- frag$end

frag$end1[frag$end1 > frag$frag$end] <- frag$end[frag$end1 > frag$frag$end] - 1
frag$start2[frag$start2 < frag$frag$start] <- frag$start[frag$start2 < frag$frag$start] + 1

frag$chr <- "chr2"
frag$name <- paste0("read", 1:nrow(frag))
frag$score <- 0
frag$orientation <- sample(c("+", "-"), nrow(frag), replace = TRUE)
frag$read.start <- apply(frag, 1, function(v) {
  ifelse(v["orientation"] == "+", v["start1"], v["start2"])
})
frag$read.end <- apply(frag, 1, function(v) {
  ifelse(v["orientation"] == "+", v["end1"], v["end2"])
})
write.table(frag[, c("chr", "read.start", "read.end", "name", "score", "orientation")],
            file = "/tmp/rep1.bed",
            sep = "\t", col.names = F, row.names = F, quote = F)


set.seed(2)
peak.width <- 100
frag.length <- 350
read.length <- 40
gauss.centers <- c(74670050, 74668300, 74665000)
reads.per.peaks <- c(1000, 3000, 1000)
inputs.df <- data.frame(gauss.center = gauss.centers, reads.per.peak = reads.per.peaks)

rand.center <- do.call(c, apply(inputs.df, 1, function(v){
  rnorm(n = v["reads.per.peak"], mean = v["gauss.center"], sd = peak.width)
}))
rand.frag.length <- rnorm(n = sum(reads.per.peaks), mean = frag.length, sd = frag.length / 4)

frag <- data.frame(start = as.integer(rand.center - rand.frag.length / 2),
                   end = as.integer(rand.center + rand.frag.length / 2))
frag$start1 <- frag$start
frag$end1 <- frag$start + read.length
frag$start2 <- frag$end - read.length
frag$end2 <- frag$end

frag$end1[frag$end1 > frag$frag$end] <- frag$end[frag$end1 > frag$frag$end] - 1
frag$start2[frag$start2 < frag$frag$start] <- frag$start[frag$start2 < frag$frag$start] + 1

frag$chr <- "chr2"
frag$name <- paste0("read", 1:nrow(frag))
frag$score <- 0
frag$orientation <- sample(c("+", "-"), nrow(frag), replace = TRUE)
frag$read.start <- apply(frag, 1, function(v) {
  ifelse(v["orientation"] == "+", v["start1"], v["start2"])
})
frag$read.end <- apply(frag, 1, function(v) {
  ifelse(v["orientation"] == "+", v["end1"], v["end2"])
})
write.table(frag[, c("chr", "read.start", "read.end", "name", "score", "orientation")],
            file = "/tmp/rep2.bed",
            sep = "\t", col.names = F, row.names = F, quote = F)

set.seed(3)
peak.width <- 100
frag.length <- 350
read.length <- 40
# gauss.centers <- c(74670000, 74668000, 74666000)
# gauss.centers <- c(74670050, 74668300, 74665000)
gauss.centers <- c(74670100, 74667950, 74665050)
reads.per.peaks <- c(200, 100, 600)
inputs.df <- data.frame(gauss.center = gauss.centers, reads.per.peak = reads.per.peaks)

rand.center <- do.call(c, apply(inputs.df, 1, function(v){
  rnorm(n = v["reads.per.peak"], mean = v["gauss.center"], sd = peak.width)
}))
rand.frag.length <- rnorm(n = sum(reads.per.peaks), mean = frag.length, sd = frag.length / 4)

frag <- data.frame(start = as.integer(rand.center - rand.frag.length / 2),
                   end = as.integer(rand.center + rand.frag.length / 2))
frag$start1 <- frag$start
frag$end1 <- frag$start + read.length
frag$start2 <- frag$end - read.length
frag$end2 <- frag$end

frag$end1[frag$end1 > frag$frag$end] <- frag$end[frag$end1 > frag$frag$end] - 1
frag$start2[frag$start2 < frag$frag$start] <- frag$start[frag$start2 < frag$frag$start] + 1

frag$chr <- "chr2"
frag$name <- paste0("read", 1:nrow(frag))
frag$score <- 0
frag$orientation <- sample(c("+", "-"), nrow(frag), replace = TRUE)
frag$read.start <- apply(frag, 1, function(v) {
  ifelse(v["orientation"] == "+", v["start1"], v["start2"])
})
frag$read.end <- apply(frag, 1, function(v) {
  ifelse(v["orientation"] == "+", v["end1"], v["end2"])
})
write.table(frag[, c("chr", "read.start", "read.end", "name", "score", "orientation")],
            file = "/tmp/rep3.bed",
            sep = "\t", col.names = F, row.names = F, quote = F)
# Then in bash
# for sample in 1 2 3; do bedtools getfasta -nameOnly -s -fi ~/igv/genomes/seq/mm10.fa -bed rep${sample}.bed | seqtk seq -F 'A' - > rep${sample}.fastq; done
# Then in galaxy bowtie2 on mm10

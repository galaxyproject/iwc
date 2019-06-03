# IWC - Intergalactic Workflow Commission

## This group exists to create a registry of community workflows. 

### Reproducibility is important. Our goals are to:
 - foster workflow use
 - incorporate versioning
 - capture more metadata: (names, versions, authors, use cases, etc.)
 - help scientists find workflows!

### Methods Proposal
 - discover workflows
 - establish quality standards (version numbers, tools exist, author is set, training available, test exists ...)
 - automated testing of workflows utilizing [Planemo](https://github.com/galaxyproject/planemo) test
 - two layers of test data:
   - basic functionality testing (quick to run, tools exist) 
   - downsampled data (validity of workflow results)

### Import process:
 - submit a pull request (PR) that adds a link to a GA file and metadata  
 - confirm that the GA and metadata conform to standards (linting criteria to be defined)
 - test the workflow 
 - if linting passes, tests pass, and human review passes, PR is merged and added to registry list

### Meeting minutes:
 * [the notes](https://github.com/galaxyproject/iwc/issues/3) from the initial meeting at GCCBOSC2018 CoFest

## Galaxy Workflow Best Practices

### Goals and intended audience

Galaxy Workflow Best Practices are intended to help Galaxy users (such as experimental scientists, bioinformaticians, etc), Galaxy workflow developers/maintainers and Galaxy administrators cut the cost and turnaround time of data analysis, maintenance and development by making more mindful decisions about their work. This is similar to best practices that have been used for many years in other computational and data analysis fields (Python, Perl, Ruby, R, bash, etc). 

### Usage

The so-called Best Practices, despite their ambitious name, are not meant to be the best for everyone and for every environment. They are not a set of strict, dogmatic rules written by all-knowing benevolent dictator(s). Each specific team of developers and users should choose the style that works best for them long-term.

It is perfectly fine if the team deliberately decides to **change every best practice rule to its exact polar opposite**. We consider that Galaxy Workflow Best Practices fulfilled their goal if the net result is that they helped a few teams make thoughtful, deliberate decisions that work well for them long-term, to stick with these decisions for as long as it makes sense, and to periodically revise these practices as the ever-changing nature of work and life requires it.

### References

This section may be of interest to developers rather than users.

Galaxy Workflow Best Practices are loosely based on the following sources:
- Galaxy (to fit better with the rest of the Galaxy development):
  - [Galaxy Tool Development Standards and Best Practices](https://github.com/galaxy-iuc/standards)
  - [Best Practices for Creating Galaxy Tools](https://galaxy-iuc-standards.readthedocs.io/en/latest/best_practices.html)

### See also

#### Best practices in other computational and data analysis fields

This section may be of interest to developers rather than users.

Other sources that served as templates, inspirations, and sources of ideas. They were also used to avoid reinventing the wheel in design, layout, style, etc:

- Python
  - [PEP 8 -- Style Guide for Python Code](https://www.python.org/dev/peps/pep-0008/)
  - [](https://github.com/google/styleguide/blob/gh-pages/pyguide.md)

- Ruby
  - [Ruby Style Guide from Rubocop](https://github.com/rubocop-hq/ruby-style-guide)
  - [RuboCop](https://github.com/rubocop-hq/rubocop) - a Ruby static code analyzer and code formatter. Out of the box it will enforce many of the guidelines outlined in the community Ruby Style Guide
  - [Airbnb's Ruby Style Guide](https://github.com/airbnb/ruby)

- Perl
  - ["Perl Best Practices" by Damian Conway](https://www.oreilly.com/library/view/perl-best-practices/0596001738/) - the highly influential, industry standard book on "Perl Best Practices". Most of the well-known Perl developers wrote glowing reviews for this book on Amazon and elsewhere. Half of the book is non-specific to Perl and can be useful to any developer in any tool or language (Galaxy, Python, etc). The design, layout, and style are really good, so they are adopted for Galaxy Workflow Best Practices as well.
  - [Perl Best Practices Quick Reference Guide](http://www.squirrel.nl/pub/PBP_refguide-1.02.00.pdf) - a short version of "Perl Best Practices" by Damian Conway, useful if you have read the book already. The level 2 and 3 headers/subheaders in Galaxy Workflow Best Practices can be automatically parsed, to quickly create a simillar Galaxy Workflow Best Practices Quick Reference Guide.
  - [Perl::Critic](https://metacpan.org/pod/Perl::Critic) - a module (library) to critique Perl source code for best-practices. It is based on multiple sources, including many verbatim quotes from the book "Perl Best Practices" by Damian Conway. It is the most popular Perl static code analyzer, which is another indicator of how influential the book is among practicing developers in that field. Galaxy Workflow Best Practices can be used similarly to extend [planemo](https://github.com/galaxyproject/planemo) (command-line utilities to assist in developing Galaxy and Common Workflow Language tools) from Galaxy tools to Galaxy workflows for static code analysis.

- R
  - [Style guide by Hadley Wickham](http://adv-r.had.co.nz/Style.html)

- bash
  - [Bash Style Guide from Numenta](https://github.com/numenta/numenta-apps/wiki/Bash-Style-Guide)
  - [Shell Style Guide from Google](https://google.github.io/styleguide/shell.xml)


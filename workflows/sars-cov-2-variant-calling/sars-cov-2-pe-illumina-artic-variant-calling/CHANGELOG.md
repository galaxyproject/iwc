0.2
---------
- Turn the AmpliconRemoval variant FILTER into an AmpliconBias INFO flag
- Make sure the header information about the flag gets propagated to the final
  VCF
- Apply the strand-bias filter only after variant annotation with snpEff. By
  producing fully annotated VCFs with and without filtering, downstream
  workflows can easily be switched between filtered/unfiltered input data

0.1
---------
- Initial version of COVID-19: variation analysis on ARTIC PE data workflow

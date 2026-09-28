// Protein browser content for eukaryotic transcription: groups, then one entry per protein in display
// order. `notes` is the section id in notes.html; `related` lists other entry ids.
export const GROUPS=[
  {id:'polymerases',title:'RNA polymerases',
    intro:'Eukaryotes have three types of RNA polymerase, each responsible for transcribing one of the major classes of genes. All three are large complexes of many subunits, five of them common to all three.'},
  {id:'basal',title:'Basal transcription factors',
    intro:'Unlike bacterial RNA polymerase, a eukaryotic RNA polymerase cannot read the DNA sequence to find a promoter. Basal transcription factors must first bind the promoter in a defined order, and the polymerase then binds the factor–DNA complex.'},
  {id:'chromatin',title:'Chromatin and DNA methylation',
    intro:'Eukaryotic transcription acts on a chromatin template, which must be opened before RNA polymerase can bind the promoter. Methylation of promoter DNA, an epigenetic mark, can keep a promoter silent.'}
];

export const PROTEINS=[
  {id:'rnap1',group:'polymerases',name:'RNA polymerase I',symbol:'RNAP I',gene:null,
    short:'Transcribes rRNA (not 5S) in the nucleolus',
    notes:'rnap-i',
    related:['sl1','ubf','tbp','rnap2','rnap3'],
    aka:['Pol I'],
    facts:[
      'RNA polymerase I (RNAP I) transcribes rRNA, but not 5S rRNA.',
      'It resides in the nucleolus, a small, dense region of the nucleus responsible for the synthesis of ribosomal RNA. Ribosome assembly also occurs in the nucleolus.',
      'It is the most prominent of the three eukaryotic RNA polymerases, and accounts for most of the cellular RNA synthesis in terms of quantity.',
      'It transcribes only the genes for ribosomal RNA, from a single type of promoter.',
      'Its precursor transcript includes the sequences of both the large 28S and the small 18S rRNAs, as well as 5.8S rRNA, separated by transcribed spacers. The precursor is later processed by cleavages and modifications, and the transcribed spacers are degraded.',
      'There are many copies of the rRNA transcription unit, joined together by non-transcribed spacers and organised into a tandem cluster.',
      'Its promoter is bipartite. The core promoter surrounds the start point, from −45 to +20, and is sufficient for transcription to initiate; the upstream promoter element (UPE) extends from −180 to −107.',
      'Both promoter regions are GC rich, except for a short AT-rich stretch around the start point.',
      'It requires two transcription factors to recognise its promoter. SL1, which contains TBP, binds the core promoter and positions RNAP I at the start point; UBF binds the upstream promoter element and increases the ability of SL1 to bind the core promoter.',
      'Like all eukaryotic RNAPs, it is a large complex of many subunits. Its two largest subunits are homologous to the β and β′ subunits of bacterial RNA polymerase, and it shares the five subunits common to all three RNAPs.',
      'It has no subunit analogous to the bacterial σ factor; that function is contained within its basal transcription factors.',
      'The effect of DNA methylation is well characterised at promoters for RNAP I and RNAP II.'
    ]},
  {id:'rnap2',group:'polymerases',name:'RNA polymerase II',symbol:'RNAP II',gene:null,
    short:'Transcribes mRNA and some small RNAs · has the CTD',
    notes:'rnap-ii',
    related:['rpb1','tfiid','tfiib','tfiif','tfiie','tfiih','tbp'],
    aka:['Pol II'],
    facts:[
      'RNA polymerase II (RNAP II) transcribes mRNA and some small RNAs.',
      'It is located in the nucleoplasm, the region of the nucleus not including the nucleolus.',
      'It synthesises heterogeneous nuclear RNA (hnRNA), the precursor to most mRNA. Classically, hnRNA is defined as all RNA that is not rRNA or tRNA.',
      'It is a large complex of approximately 500 kD, made of 12 or so subunits.',
      'Its two largest subunits are homologous to the β′ and β subunits of bacterial RNA polymerase, and another subunit is related to bacterial α. Its remaining subunits include the five subunits common to all three RNAPs.',
      'It has no subunit analogous to the bacterial σ factor; that function is contained within the basal transcription factors.',
      'Unlike bacterial RNA polymerase, it cannot read the DNA sequence to find and bind the promoter. Basal transcription factors must first bind, and RNAP II then binds the basal transcription factor–DNA complex at the core promoter.',
      'Its largest subunit carries the carboxy-terminal domain (CTD), a tail of repeated amino acid sequence that is unique to RNAP II.',
      'In the ordered assembly of the basal apparatus, TFIID, which contains TBP, binds the promoter first and TFIIB joins it. RNAP II then arrives together with TFIIF, followed by TFIIE and finally TFIIH.',
      'Phosphorylation of the CTD converts the polymerase from the IIa form to the IIo form, which leaves the promoter with TFIIF to transcribe the gene. TFIIE and TFIIH are released, while TBP and TFIIB can remain at the promoter.',
      'A typical RNAP II promoter extends upstream from the start site and contains several short (~10 bp) elements that bind transcription factors, dispersed over ~100 bp.',
      'An enhancer, with a more closely packed array of elements that bind transcription factors, may lie several hundred base pairs to several kilobases away. The DNA may coil so that the factors at the enhancer and the promoter interact to form a large protein complex.',
      'A potentially active gene in open chromatin, bound to RNAP, is called a poised gene. It may assemble the basal apparatus, but cannot proceed to transcribe the gene without a second signal to initiate transcription.'
    ]},
  {id:'rnap3',group:'polymerases',name:'RNA polymerase III',symbol:'RNAP III',gene:null,
    short:'Transcribes tRNA, 5S rRNA and other small RNAs',
    notes:'rnap-iii',
    related:['tfiiib','tfiiic','tfiiia','tbp','rnap1'],
    aka:['Pol III'],
    facts:[
      'RNA polymerase III (RNAP III) transcribes tRNA, 5S ribosomal RNA and other small RNAs.',
      'It is a nucleoplasmic enzyme and a minor enzyme in terms of activity, yet it produces a collection of stable, essential RNAs that constitute over a quarter of cytoplasmic RNA.',
      'Like all eukaryotic RNAPs, it is a large complex of many subunits. Its two largest subunits are homologous to the β and β′ subunits of bacterial RNA polymerase, and it shares the five subunits common to all three RNAPs.',
      'It has no subunit analogous to the bacterial σ factor; that function is contained within its basal transcription factors.',
      'It has three types of promoter, each recognised in a different way by different factors.',
      'Many of its promoters are internal promoters, located downstream of the start point within the transcription unit. Type 1 (5S rRNA) promoters contain A, intermediate and C elements; type 2 promoters, including tRNA promoters, contain boxA and boxB.',
      'Type 3 promoters instead consist of separated sequences upstream of the start point: Oct, PSE and TATA.',
      'At internal promoters, assembly factors bound downstream of the start point position TFIIIB upstream of it, and TFIIIB, which contains TBP, then recruits RNAP III to the start point.',
      'TFIIIB is the only true initiation factor that RNAP III requires: its presence near the start point is sufficient for the polymerase to identify and bind at the start point.'
    ]},
  {id:'rpb1',group:'polymerases',name:'Largest subunit of RNAP II',symbol:'Rpb1',gene:null,
    short:'Related to bacterial β′ · carries the CTD',
    notes:'the-large-subunit-of-rnap-ii',
    related:['rnap2','tfiih','tfiif'],
    facts:[
      'The largest subunit of RNAP II is related to the bacterial β′ subunit, and binds DNA.',
      'The second-largest subunit is related to bacterial β and binds nucleotides. Together, the two largest subunits are homologous to the β′ and β subunits of bacterial RNA polymerase.',
      'It has a carboxy-terminal domain (CTD) that consists of multiple repeats of a consensus sequence of amino acids. This sequence is unique to RNAP II.',
      'The consensus repeat is the heptapeptide Tyr–Ser–Pro–Thr–Ser–Pro–Ser (YSPTSPS). The CTD has 26 repeats in yeast and 52 in mouse.',
      'The number of repeats is important: mutations that remove more than half of them are lethal.',
      'The CTD is involved in regulating the initiation reaction, transcription elongation and all aspects of mRNA processing, and even the export of mRNA to the cytoplasm.',
      'The serines at positions 2 and 5 of each heptapeptide can be phosphorylated.',
      'Phosphorylation of the CTD converts RNAP II from the IIa form to the IIo form, which leaves the promoter with TFIIF to transcribe the gene.'
    ]},
  {id:'tbp',group:'basal',name:'TATA-binding protein',symbol:'TBP',gene:null,
    short:'Universal factor · bends DNA at the TATA box',
    notes:'tata-binding-protein-tbp-is-a-universal-factor',
    related:['tfiid','sl1','tfiiib','tfiib'],
    facts:[
      'TBP is a universal factor: it is a component of the RNAP I factor SL1, the RNAP II factor TFIID and the RNAP III factor TFIIIB.',
      'RNA polymerases are positioned at all promoters by a factor that contains TBP.',
      'It directly recognises TATA DNA at TATA-containing promoters, while other components of its complexes help position the machinery at TATA-less promoters.',
      'TBP binds DNA in the minor groove, which is unusual for a DNA-binding protein.',
      'It forms a saddle-like structure around the DNA, causing it to bend by approximately 80°. This sharp kink is accompanied by significant unwinding of the DNA, and allows other transcription machinery to bind.',
      'The cocrystal structure of TBP with DNA from −40 to the start point shows a bend at the TATA box that widens the narrow groove where TBP binds.',
      'Its larger outer surface is exposed and available to contact other proteins for the recruitment of RNAP.',
      'In TFIID and in SL1, TBP is joined by several TBP-associated factors (TAFs).',
      'At RNAP II promoters, TBP and TFIIB can remain at the promoter after the polymerase leaves to transcribe the gene.'
    ]},
  {id:'tfiid',group:'basal',name:'TFIID',symbol:'TFIID',gene:null,
    short:'First to bind RNAP II promoters · TBP plus TAFs',
    notes:'the-basal-apparatus-assembles-at-the-promoter-of-rnap-ii',
    related:['tbp','tfiib','rnap2','sl1','tfiiib'],
    facts:[
      'TFIID is a basal transcription factor for RNAP II that contains TBP and several TBP-associated factors (TAFs).',
      'Its TAFs include TAF1, TAF2, TAF4, TAF5, TAF6, TAF9 and TAF10, which assemble with TBP to form TFIID.',
      'It binds the promoter first in the fixed order of assembly of the basal apparatus; TFIIB then joins it.',
      'Its TBP directly recognises TATA DNA at TATA-containing promoters, while other TFIID components help position the machinery at TATA-less promoters.',
      'It is the TBP-containing factor that positions RNAP II at its promoters, as SL1 does for RNAP I and TFIIIB for RNAP III.',
      'When RNAP II leaves the promoter to transcribe the gene, TBP and TFIIB can remain at the promoter.'
    ]},
  {id:'tfiib',group:'basal',name:'TFIIB',symbol:'TFIIB',gene:null,
    short:'Joins TFIID · second to bind the promoter',
    notes:'the-basal-apparatus-assembles-at-the-promoter-of-rnap-ii',
    related:['tfiid','tbp','tfiif','rnap2'],
    facts:[
      'TFIIB is a basal transcription factor for RNAP II.',
      'It joins TFIID at the promoter, second in the fixed order of assembly of the basal apparatus.',
      'It binds beside TBP on the promoter DNA, and RNAP II then arrives together with TFIIF, followed by TFIIE and finally TFIIH.',
      'When phosphorylation of the CTD converts RNAP II to the IIo form and the polymerase leaves the promoter, TBP and TFIIB can remain at the promoter.'
    ]},
  {id:'tfiif',group:'basal',name:'TFIIF',symbol:'TFIIF',gene:null,
    short:'Arrives with RNAP II · leaves the promoter with it',
    notes:'the-basal-apparatus-assembles-at-the-promoter-of-rnap-ii',
    related:['rnap2','tfiib','tfiie','rpb1'],
    facts:[
      'TFIIF is a basal transcription factor for RNAP II.',
      'RNAP II arrives at the promoter together with TFIIF, after TFIID and TFIIB have bound.',
      'Its arrival is followed by TFIIE and finally TFIIH.',
      'When phosphorylation of the CTD converts RNAP II from the IIa form to the IIo form, the polymerase leaves the promoter with TFIIF to transcribe the gene. TFIIE and TFIIH, by contrast, are released.'
    ]},
  {id:'tfiie',group:'basal',name:'TFIIE',symbol:'TFIIE',gene:null,
    short:'Joins after RNAP II and TFIIF, before TFIIH',
    notes:'the-basal-apparatus-assembles-at-the-promoter-of-rnap-ii',
    related:['tfiif','tfiih','rnap2'],
    facts:[
      'TFIIE is a basal transcription factor for RNAP II.',
      'It joins the initiation complex after RNAP II and TFIIF have arrived.',
      'It is followed by TFIIH, the last factor to join. The full order is TFIID, TFIIB, RNAP II with TFIIF, TFIIE and then TFIIH.',
      'When RNAP II is converted to the IIo form and leaves the promoter, TFIIE is released along with TFIIH.'
    ]},
  {id:'tfiih',group:'basal',name:'TFIIH',symbol:'TFIIH',gene:null,
    short:'Last factor to join the RNAP II initiation complex',
    notes:'the-basal-apparatus-assembles-at-the-promoter-of-rnap-ii',
    related:['tfiie','rpb1','rnap2','tfiif'],
    facts:[
      'TFIIH is a basal transcription factor for RNAP II.',
      'It is the last factor to join the initiation complex, after TFIIE.',
      'Once TFIIH has joined, the CTD of RNAP II is phosphorylated, converting the polymerase from the IIa form to the IIo form.',
      'TFIIH is released, with TFIIE, when RNAP II leaves the promoter with TFIIF to transcribe the gene.',
      'It is also found with RNAP I at the rDNA in the nucleolus.'
    ]},
  {id:'sl1',group:'basal',name:'SL1',symbol:'SL1',gene:null,
    short:'Binds the RNAP I core promoter · contains TBP',
    notes:'rnap-is-promoters',
    related:['ubf','tbp','rnap1'],
    aka:['core-binding factor'],
    facts:[
      'SL1, also called the core-binding factor, is the factor that binds the core promoter of RNAP I.',
      'It is a multisubunit complex containing one TATA-binding protein (TBP) and several RNAP I-specific TBP-associated factors (TAFs), including TAF1A, TAF1B, TAF1C and TAF1D.',
      'It is primarily responsible for the binding of RNAP I at the start point, and is also responsible for transcription initiation.',
      'The RNAP I holoenzyme includes SL1, which binds to the core promoter.',
      'The core promoter it binds surrounds the start point, from −45 to +20, and is sufficient for transcription to initiate.',
      'UBF binding to the upstream promoter element increases the ability of SL1 to bind the core promoter.',
      'Like TFIIIB in RNAP III promoter assembly, it contains TBP.'
    ]},
  {id:'ubf',group:'basal',name:'Upstream binding factor',symbol:'UBF',gene:null,
    short:'Binds the RNAP I upstream promoter element',
    notes:'rnap-is-promoters',
    related:['sl1','rnap1','tbp'],
    aka:['UBF1'],
    facts:[
      'UBF (upstream binding factor) binds the upstream promoter element (UPE) of RNAP I promoters.',
      'The UPE is a GC-rich sequence extending from −180 to −107, separated by ~70 bp from the core promoter.',
      'The DNA wraps around bound UBF.',
      'UBF binding to the UPE increases the ability of the core-binding factor, SL1, to bind the core promoter.',
      'It is one of the two transcription factors that RNAP I requires to recognise its promoter; the other is SL1.'
    ]},
  {id:'tfiiia',group:'basal',name:'TFIIIA',symbol:'TFIIIA',gene:null,
    short:'Assembly factor at 5S rRNA (type 1) promoters',
    notes:'rnap-iiis-promoters-and-transcription-factors',
    related:['tfiiic','tfiiib','rnap3'],
    facts:[
      'TFIIIA is an RNAP III transcription factor that acts at type 1 promoters, the internal promoters of 5S rRNA genes.',
      'Type 1 promoters contain A, intermediate and C elements downstream of the start point, and recruit TFIIIA followed by TFIIIC.',
      'With TFIIIC, it acts as an assembly factor that assists the binding and positioning of TFIIIB upstream of the start point.',
      'Once TFIIIB is bound, TFIIIA can be removed without affecting the initiation reaction.',
      'It forms part of the basal apparatus.'
    ]},
  {id:'tfiiib',group:'basal',name:'TFIIIB',symbol:'TFIIIB',gene:null,
    short:'Positions RNAP III · its only true initiation factor',
    notes:'rnap-iiis-promoters-and-transcription-factors',
    related:['tfiiic','tfiiia','tbp','rnap3'],
    facts:[
      'TFIIIB is the positioning factor for RNAP III. Like SL1 in RNAP I promoter assembly, it contains the TATA-binding protein (TBP).',
      'Its subunits include TBP, BRF1 and BDP1.',
      'At internal promoters, assembly factors bound downstream of the start point position TFIIIB upstream of it: TFIIIA and TFIIIC at type 1 promoters, and TFIIIC at type 2 promoters.',
      'TFIIIB then recruits RNAP III to the start point.',
      'It remains bound in the vicinity of the start point, and its presence is sufficient to allow RNAP III to identify and bind at the start point. TFIIIB is therefore the only true initiation factor required by RNAP III.',
      'Once TFIIIB is bound, the assembly factors can be removed without affecting the initiation reaction.'
    ]},
  {id:'tfiiic',group:'basal',name:'TFIIIC',symbol:'TFIIIC',gene:null,
    short:'Binds boxA and boxB · recruits TFIIIB',
    notes:'rnap-iiis-promoters-and-transcription-factors',
    related:['tfiiib','tfiiia','rnap3'],
    facts:[
      'TFIIIC is an RNAP III transcription factor that binds internal promoter elements downstream of the start point.',
      'At type 2 promoters, including tRNA promoters, it binds the A and B boxes directly.',
      'At type 1 (5S rRNA) promoters, it is recruited after TFIIIA.',
      'TFIIIC then recruits TFIIIB, positioning it upstream of the start point, and TFIIIB recruits RNAP III.',
      'It acts as an assembly factor: once TFIIIB is bound, TFIIIC can be removed without affecting the initiation reaction.',
      'It forms part of the basal apparatus.'
    ]},
  {id:'nucleosome',group:'chromatin',name:'Nucleosome',symbol:null,gene:null,
    short:'Packages DNA in chromatin · displaced where TFs bind',
    notes:'chromatin-must-be-opened-before-transcription-can-occur',
    related:['rnap2','dnmt1','dnmt3a','tet'],
    facts:[
      'In eukaryotes, transcription acts on a chromatin template rather than on a bare DNA template. In chromatin, the DNA is wrapped into a string of nucleosomes, which pack tightly together in closed chromatin.',
      'Chromatin must be taken into account at every step of transcription: its structure must be opened before RNA polymerase can bind to the promoter.',
      'The accessibility state of chromatin, closed or open, strongly controls whether transcription factors and RNA polymerase can bind.',
      'Chromatin ranges from closed, through permissive, to open, with its dynamics increasing along the way.',
      'In contrast to closed chromatin, permissive chromatin is dynamic enough for transcription factors to initiate sequence-specific accessibility remodelling and establish an open chromatin conformation, as at an active gene locus. Nucleosomes can be displaced where transcription factors bind.',
      'Promoters are found in three basic types of chromatin: an inactive gene is in closed chromatin, a poised gene is in open chromatin bound to RNAP, and an active gene is in open chromatin.',
      'Co-activators, recruited by DNA-bound activators, can stimulate transcription through chromatin modification.'
    ]},
  {id:'dnmt1',group:'chromatin',name:'Maintenance methyltransferase',symbol:'DNMT1',gene:null,
    short:'Maintains CG methylation after DNA replication',
    notes:'gene-expression-is-associated-with-demethylation',
    related:['dnmt3a','tet','nucleosome'],
    facts:[
      'A maintenance methyltransferase is a DNA methyltransferase (DNMT) that acts on DNA already methylated on one strand of a CG doublet after replication.',
      'DNA methyltransferases methylate carbon 5 of cytosine, creating 5-methylcytosine, typically at CG doublets (CpG sites).',
      'Although DNA methylation is reversible, it can be stably maintained over many cell divisions.',
      'In sexual reproduction, most methylation information from the sperm or oocyte is erased, but imprinted genes keep their sex-specific methylation patterns. As a result, maternal and paternal alleles are differentially expressed in the offspring.',
      'At promoters silenced by DNA methylation, methylation can prevent transcription even if the specific transcription factors for that promoter are present.',
      'The drug 5-azacytidine is incorporated into DNA but cannot be methylated, which leads to demethylation of the DNA during replication.'
    ]},
  {id:'dnmt3a',group:'chromatin',name:'De novo methyltransferase',symbol:'DNMT3A',gene:null,
    short:'Methylates previously unmethylated CG sites',
    notes:'gene-expression-is-associated-with-demethylation',
    related:['dnmt1','tet','nucleosome'],
    facts:[
      'A de novo methyltransferase is a DNA methyltransferase (DNMT) that can methylate a previously unmethylated CG site.',
      'DNA methyltransferases methylate carbon 5 of cytosine, creating 5-methylcytosine.',
      'Methylation of DNA is a key epigenetic regulatory event: a change that does not alter the DNA sequence itself, but is often heritable.',
      'In eukaryotes, and especially mammals, methylation typically occurs at CG doublets, called CpG sites. CpG islands are longer regions enriched in CpG sites.',
      'CpG islands are major regulatory units: around 50% lie in gene promoter regions and another 25% in gene bodies. Around 60–70% of human genes have a CpG island in their promoter region.',
      'In a typical mammalian genome, CpG sites within CpG islands are largely unmethylated, while scattered CpG sites, including those in transposable elements and gene bodies, are mostly methylated.',
      'A lack of gene expression is associated with methylation of the promoter region, although the body of an active gene is often methylated.'
    ]},
  {id:'tet',group:'chromatin',name:'TET enzymes',symbol:'TET',gene:null,
    short:'Start the removal of methyl groups from cytosine',
    notes:'gene-expression-is-associated-with-demethylation',
    related:['dnmt1','dnmt3a','nucleosome'],
    facts:[
      'TET enzymes are key players in DNA demethylation. They oxidise the methyl group of 5-methylcytosine in steps, initiating a repair pathway that replaces the modified base with an unmethylated cytosine.',
      'At promoters silenced by DNA methylation, loss of promoter methylation can permit activation, but promoter demethylation is not universally required for transcription.',
      'A gene that is actively being transcribed is generally undermethylated, particularly at its 5′ promoter region, whereas a lack of expression is associated with methylation there. The body of an active gene, however, is often methylated.',
      'The pattern of methylated promoters being off and unmethylated promoters being on is not universal.',
      'Indirect evidence that demethylation can permit activation comes from 5-azacytidine, which is incorporated into DNA but cannot be methylated. It leads to demethylation during replication and can activate muscle-specific genes in non-muscle cells.'
    ]}
];

/* Accuracy notes (kept off screen):
   - Shared subunits: five subunits are shared by RNAP I, II and III (Rpb5, Rpb6, Rpb8, Rpb10 and Rpb12
     in yeast), as the source text now says. Its SDS-gel drawing of yeast RNAP II marks only three
     bands as common and leaves the smallest bands unlabelled.
   - Size: "approximately 500 kD, 12 or so subunits" fits RNAP II (12 subunits in yeast), so only the
     RNAP II entry gives it. Yeast RNAP I has 14 subunits and RNAP III has 17, as the source text also
     says, so their entries say "a large complex of many subunits".
   - Symbols Rpb1, DNMT1 and DNMT3A are the standard names for the largest RNAP II subunit and for the
     main maintenance and de novo methyltransferases; the source text describes these proteins by
     function only, and their facts stay within what it says. Genes are left null because the source
     text names none.
   - Nucleosome has no symbol. The source text never names nucleosomes; its chromatin-opening figure
     draws them (DNA wrapped into a string of particles, packed in closed chromatin, displaced where
     TFs bind), so that entry's facts stay with the chromatin text and that figure. */

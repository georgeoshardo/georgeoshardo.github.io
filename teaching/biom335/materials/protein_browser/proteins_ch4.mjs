// Protein browser content for chapter 4, RNA splicing and processing: groups, then one entry per molecule in display
// order. `notes` is the section id in notes.html; `related` lists other entry ids (here also the eukaryotic chapter's
// RNA polymerase II, `rnap2`, which the capping enzyme sits on).
export const GROUPS=[
  {id:'cap',title:'The 5′ cap',
    intro:'Shortly after initiation, RNA polymerase II pauses about 30 nucleotides downstream while capping enzymes add a guanine to the 5′ end of the new RNA by an unusual 5′–5′ triphosphate linkage. The cap is recognised by one set of proteins in the nucleus and another in the cytoplasm.'},
  {id:'spliceosome',title:'snRNPs and the spliceosome',
    intro:'Splicing occurs within the spliceosome, a large complex formed by the sequential assembly of snRNPs and other proteins onto the pre-mRNA. Each snRNP contains a single snRNA and several proteins. The intron leaves as a lariat, which is debranched and degraded.'},
  {id:'commitment',title:'Splice-site recognition',
    intro:'The first step in splicing is the binding of the U1 snRNP to the 5′ splice site. With U2AF on the polypyrimidine tract and SF1/BBP on the branch site, it forms the commitment (E) complex, which SR proteins stabilise in multicellular eukaryotes.'},
  {id:'alternative',title:'Alternative splicing',
    intro:'Over 90% of mammalian genes undergo alternative splicing, so one gene can produce several mRNAs and proteins. Including or excluding exons can change a protein’s function or its location in the cell; an exon with a premature stop codon can have its mRNA degraded.'}
];

export const PROTEINS=[
  {id:'capping',group:'cap',name:'Capping enzyme',symbol:null,gene:null,
    short:'Adds the cap’s guanine as RNA polymerase II pauses',
    notes:'the-5-end-of-eukaryotic-mrna-is-capped',
    related:['cbc','eif4e','rnap2'],
    aka:['guanylyl-transferase (GT)'],
    facts:[
      'Transcription starts with a nucleoside triphosphate, usually an A or a G, but the 5′ end of a mature mRNA carries a 5′ cap instead: a guanine (G) added to the terminal base of the transcript by an unusual 5′–5′ triphosphate linkage.',
      'Capping happens during transcription. Shortly after initiation, RNA polymerase II pauses about 30 nucleotides downstream, and the pause allows capping enzymes to be recruited to add the cap to the 5′ end of the new RNA.',
      'Without this protection the nascent RNA is vulnerable to degradation by exonucleases, so capping is an important checkpoint for the polymerase to continue elongation and transcribe the rest of the gene.',
      'The terminal G is added by guanylyl-transferase (GT), in the reverse orientation to all the other nucleotides.',
      'The capped end is then a substrate for methylation. A methyl group at the 7th position of the terminal guanine makes the monomethylated cap found on most mRNAs; some small noncoding RNAs are further methylated to a trimethylated cap.',
      'The structure is the guanylyl-transferase part of the human capping enzyme on RNA polymerase II, paused with its new RNA, whose 5′ end reaches the enzyme.'
    ]},
  {id:'cbc',group:'cap',name:'Cap-binding complex',symbol:null,gene:null,
    short:'Binds the cap in the nucleus · CBP20 and CBP80',
    notes:'the-5-end-of-eukaryotic-mrna-is-capped',
    related:['eif4e','capping'],
    aka:['CBC','CBP20/80'],
    facts:[
      'In the nucleus, the 5′ cap is recognised by the cap-binding complex (CBP20/80).',
      'The cap-binding complex stimulates the splicing of the first intron and helps with mRNA export from the nucleus.',
      'The cap is a guanine added to the 5′ end of the transcript by a 5′–5′ triphosphate linkage and methylated at its 7th position: the monomethylated cap, m7G, found on most mRNAs.',
      'The cap protects the mRNA from being degraded by 5′–3′ exonucleases.',
      'Once the mRNA is in the cytoplasm, a different set of proteins, eIF4F, binds to the cap to initiate translation.',
      'The structure is the human complex of CBP80 and CBP20 with the cap m7GpppG, which CBP20 holds.'
    ]},
  {id:'eif4e',group:'cap',name:'eIF4E',symbol:null,gene:null,
    short:'Binds the cap in the cytoplasm, as part of eIF4F',
    notes:'the-5-end-of-eukaryotic-mrna-is-capped',
    related:['cbc','capping'],
    facts:[
      'Once the mRNA is in the cytoplasm, a different set of proteins, eIF4F, binds to the cap to initiate translation. eIF4E is the protein of eIF4F that binds the cap.',
      'In the nucleus, the cap is recognised instead by the cap-binding complex (CBP20/80), which helps with mRNA export.',
      'Mature mRNA is transported through nuclear pores to the cytoplasm, where it is translated into protein.',
      'The cap protects the mRNA from being degraded by 5′–3′ exonucleases.',
      'The structure is human eIF4E bound to m7GTP: the cap’s methylated guanine with its triphosphate.'
    ]},
  {id:'smring',group:'spliceosome',name:'Sm ring',symbol:null,gene:null,
    short:'A ring of Sm proteins round an snRNA',
    notes:'the-spliceosome-and-its-components',
    related:['lsmring','u1snrnp','u2snrnp','trisnrnp'],
    aka:['Sm proteins'],
    facts:[
      'Each snRNP contains a single snRNA and several proteins. A core group of conserved Sm proteins is found in the U1, U2, U4 and U5 snRNPs.',
      'The Sm proteins are recognised by anti-Sm antibodies, which are often found in patients with autoimmune diseases like systemic lupus erythematosus.',
      'The U6 snRNP lacks Sm proteins but contains a set of Sm-like (Lsm) proteins.',
      'The five snRNAs and their associated proteins make up almost half of the mass of the spliceosome.',
      'The structure is the ring of seven Sm proteins (SmB, SmD1, SmD2, SmD3, SmE, SmF and SmG) round U4 snRNA, which threads through it.'
    ]},
  {id:'lsmring',group:'spliceosome',name:'Lsm ring',symbol:null,gene:null,
    short:'Sm-like proteins ringed round U6 snRNA’s 3′ end',
    notes:'the-spliceosome-and-its-components',
    related:['smring','trisnrnp'],
    aka:['Sm-like (Lsm) proteins'],
    facts:[
      'The U6 snRNP lacks Sm proteins but contains a set of Sm-like (Lsm) proteins.',
      'The Sm proteins themselves are found in the U1, U2, U4 and U5 snRNPs.',
      'The U4 and U6 snRNPs typically exist together as a single U4/U6 di-snRNP particle.',
      'The structure is the yeast ring of Lsm2 to Lsm8, seven Sm-like proteins, bound to the 3′ end of U6 snRNA.'
    ]},
  {id:'u2snrnp',group:'spliceosome',name:'U2 snRNP',symbol:null,gene:null,
    short:'U2 snRNA held by its proteins and an Sm ring',
    notes:'the-spliceosome-and-its-components',
    related:['smring','trisnrnp','spliceosome','u1snrnp'],
    facts:[
      'The spliceosome contains five essential snRNPs, named after the snRNA they contain: U1, U2, U5, U4 and U6. Inactivating any one of them prevents splicing.',
      'Each snRNP contains a single snRNA and several proteins, including, in U1, U2, U4 and U5, a core group of Sm proteins.',
      'Like a ribosome, the spliceosome relies heavily on RNA–RNA interactions, both between the snRNAs and the pre-mRNA and among the snRNAs themselves.',
      'The structure is the human 17S U2 snRNP: U2 snRNA held by the SF3a and SF3b complexes, U2A′ and U2B″, and a ring of Sm proteins.'
    ]},
  {id:'trisnrnp',group:'spliceosome',name:'U4/U6·U5 tri-snRNP',symbol:null,gene:null,
    short:'The U4/U6 di-snRNP bound to the U5 snRNP',
    notes:'the-spliceosome-and-its-components',
    related:['lsmring','smring','spliceosome','u2snrnp'],
    aka:['tri-snRNP'],
    facts:[
      'The U4 and U6 snRNPs typically exist together as a single U4/U6 di-snRNP particle, in which the two snRNAs are held together by base pairing.',
      'Like a ribosome, the spliceosome relies heavily on RNA–RNA interactions, both between the snRNAs and the pre-mRNA and among the snRNAs themselves. This suggests that the RNA components play a direct, possibly catalytic, role in the splicing reaction.',
      'U4 and U5 each contain a ring of Sm proteins; U6 has a ring of Sm-like (Lsm) proteins instead.',
      'The structure is the human U4/U6·U5 tri-snRNP, in which the U4/U6 di-snRNP is bound to the U5 snRNP.'
    ]},
  {id:'spliceosome',group:'spliceosome',name:'Spliceosome',symbol:null,gene:null,
    short:'snRNPs and splicing factors on the pre-mRNA',
    notes:'the-spliceosome-and-its-components',
    related:['u2snrnp','trisnrnp','dbr1','u1snrnp'],
    facts:[
      'The splicing reaction occurs within the spliceosome, a large complex, larger than a ribosome, formed by the sequential assembly of snRNPs and other proteins onto the pre-mRNA. Its primary role is to bring the 5′ and 3′ splice sites together before any cleavage occurs.',
      'It has a mass of about 12 MDa, almost half of it the five snRNAs and their associated proteins.',
      'About 70 other proteins, the splicing factors, are required for the assembly of the spliceosome, binding to the pre-mRNA and creating the catalytic centre for the transesterification reactions.',
      'Splicing occurs through two transesterification reactions. The 2′-OH of the branch-site adenine attacks the 5′ splice site, forming a lariat; the freed 3′-OH of the 5′ exon then attacks the 3′ splice site, joining the exons and releasing the intron, still a lariat.',
      'The structure is a human spliceosome just after the exons have been joined: U2, U5 and U6 snRNAs with their proteins, the joined exons and the intron lariat.'
    ]},
  {id:'dbr1',group:'spliceosome',name:'Debranching enzyme',symbol:null,gene:null,
    short:'Debranches the released intron lariat',
    notes:'splicing-proceeds-through-a-lariat-intermediate',
    related:['spliceosome','sf1'],
    aka:['Dbr1'],
    facts:[
      'After being released, the intron lariat is debranched by an enzyme, converting it back to a linear RNA molecule, which is then rapidly degraded in the nucleus.',
      'The lariat forms in the first transesterification, when the 2′-OH of the branch-site adenine attacks the 5′ splice site and the freed 5′ end of the intron is attached to that adenine.',
      'A key feature of the lariat is the unusual 2′–5′ phosphodiester bond that forms the branch point.',
      'The structure is the debranching enzyme of the amoeba Entamoeba histolytica bound to a short branched RNA: an adenine joined to one RNA chain by its 3′ end and to another by a 2′–5′ bond.'
    ]},
  {id:'u1snrnp',group:'commitment',name:'U1 snRNP',symbol:null,gene:null,
    short:'Its snRNA’s 5′ end pairs with the 5′ splice site',
    notes:'initial-splice-site-recognition-and-the-e-complex',
    related:['smring','sf1','u2af65','srsf1','spliceosome'],
    facts:[
      'The very first step in splicing is the binding of the U1 snRNP to the 5′ splice site.',
      'U1 snRNA has a single-stranded 5′ end that is complementary to the consensus sequence at the 5′ splice site, so it binds by direct RNA–RNA base pairing. The rest of the snRNA has a base-paired structure that creates several domains.',
      'Mutations that disrupt the pairing between the 5′ splice site and U1 snRNA abolish splicing, but a second, suppressor mutation in U1 snRNA that restores complementarity can rescue splicing.',
      'The binding of U1 is part of the commitment complex (the E complex in mammals), which also has U2AF on the polypyrimidine tract and SF1/BBP on the branch site.',
      'Like U2, U4 and U5, the U1 snRNP contains a ring of Sm proteins.',
      'The structure is a minimal human U1 snRNP, its snRNA shortened, with the 5′ end of U1 snRNA paired with a 5′ splice site, AG|GUAAGU.'
    ]},
  {id:'sf1',group:'commitment',name:'SF1',symbol:null,gene:null,
    short:'Binds the branch site in the commitment complex',
    notes:'initial-splice-site-recognition-and-the-e-complex',
    related:['u2af65','u1snrnp','dbr1'],
    aka:['BBP, the branch point binding protein'],
    facts:[
      'The branch point binding protein (BBP/SF1) interacts with the branch site sequence as the commitment complex forms.',
      'The branch site lies 18 to 40 nucleotides upstream of the 3′ splice site and contains a critical adenine (A) that is essential for the chemical reaction of splicing.',
      'The branch site is highly conserved in yeast (UACUAAC) but less defined in multicellular eukaryotes.',
      'In the commitment complex, U1 snRNP binds the 5′ splice site, U2AF the polypyrimidine tract and SF1/BBP the branch site. These interactions are cooperative and lock the pre-mRNA into the splicing pathway.',
      'The structure is the RNA-binding domain of human SF1 bound to an RNA containing the yeast branch site sequence, UACUAAC.'
    ]},
  {id:'u2af65',group:'commitment',name:'U2AF65',symbol:null,gene:null,
    short:'U2AF’s large subunit · binds the polypyrimidine tract',
    notes:'initial-splice-site-recognition-and-the-e-complex',
    related:['u2af35','sf1','srsf1','u1snrnp'],
    aka:['U2 auxiliary factor'],
    facts:[
      'The protein U2AF binds to the polypyrimidine tract, located between the branch site and the 3′ splice site, as the commitment complex forms.',
      'It helps recruit the components needed for branch-site and 3′ splice-site recognition.',
      'In exon definition, the predominant route in multicellular eukaryotes, U2AF binds to the 3′ splice site at the beginning of an exon and U1 snRNP to the 5′ splice site at its end.',
      'SR proteins can bind to the U1 snRNP at the 5′ site and to U2AF at the 3′ site, bridging the two ends of the intron.',
      'U2AF has two subunits, U2AF65 and U2AF35.',
      'The structure is the two RNA-binding domains of human U2AF65, slightly shortened, bound to seven uridines of a polypyrimidine tract.'
    ]},
  {id:'u2af35',group:'commitment',name:'U2AF35',symbol:null,gene:null,
    short:'U2AF’s small subunit, holding U2AF65',
    notes:'initial-splice-site-recognition-and-the-e-complex',
    related:['u2af65','sf1'],
    aka:['U2 auxiliary factor'],
    facts:[
      'U2AF binds to the polypyrimidine tract located between the branch site and the 3′ splice site. It has two subunits: U2AF65, which binds the polypyrimidine tract, and U2AF35, which binds the AG at the 3′ splice site.',
      'The intron ends with the dinucleotide AG at the 3′ splice site, as the GU–AG rule describes.',
      'The commitment complex forms when U1 snRNP binds the 5′ splice site, U2AF the polypyrimidine tract and SF1/BBP the branch site; these interactions are cooperative.',
      'The structure is the core of the U2AF heterodimer: the central domain of human U2AF35 holding a short stretch of U2AF65.'
    ]},
  {id:'srsf1',group:'commitment',name:'SRSF1',symbol:null,gene:null,
    short:'An SR protein: RNA-recognition motifs and an RS domain',
    notes:'the-role-of-sr-proteins',
    related:['u1snrnp','u2af65'],
    aka:['an SR protein'],
    facts:[
      'In multicellular eukaryotes, where splice-site consensus sequences can be weak or divergent, SR proteins are essential for forming the commitment complex.',
      'They have two key domains: an N-terminal RNA-recognition motif for binding to specific RNA sequences, and a C-terminal RS domain, rich in arginine/serine dipeptides, that mediates protein–protein interactions.',
      'SR proteins act as a molecular glue, stabilising the E complex: they can bind to the U1 snRNP at the 5′ site and to U2AF at the 3′ site, bridging the two ends of the intron.',
      'In exon definition, SR proteins often help define an exon by binding to specific sequences within it.',
      'SR proteins are not found in the yeast Saccharomyces cerevisiae, whose splice sites are highly conserved and do not require this extra layer of recognition.',
      'The structure is the second of human SRSF1’s two RNA-recognition motifs bound to the RNA UGAAGGAC.'
    ]},
  {id:'camkii',group:'alternative',name:'CaMKIIδ',symbol:null,gene:null,
    short:'A kinase sent to cytoplasm, nucleus or membrane',
    notes:'functional-consequences-of-alternative-splicing',
    related:['bclxl','ejc'],
    facts:[
      'By including or excluding specific exons, alternative splicing can add or remove protein domains. This can change a protein’s function, its location within the cell, or its interaction with other molecules. A classic example is the CaMKIIδ gene.',
      'Skipping all three alternative exons produces a cytoplasmic kinase.',
      'Including exon 14, which contains a nuclear localisation signal, sends the kinase to the nucleus.',
      'Including exons 15 and 16 targets the kinase to the cell membrane, which is common in neurons.',
      'The structure is the human CaMKIIδ holoenzyme: twelve subunits whose hub domains join in a central ring, with their kinase domains around it. The linker between the two domains is shortened.'
    ]},
  {id:'bclxl',group:'alternative',name:'Bcl-xL',symbol:null,gene:'BCL2L1',
    short:'The long, anti-apoptotic isoform of Bcl-x',
    notes:'functional-consequences-of-alternative-splicing',
    related:['camkii'],
    facts:[
      'Bcl-x is a key member of the Bcl-2 family of apoptosis regulators. The BCL2L1 gene, which codes for Bcl-x, undergoes alternative splicing to produce two major isoforms with opposing functions.',
      'Bcl-xL (long) is anti-apoptotic, or pro-survival. It is the larger protein and works by preventing the release of mitochondrial factors like cytochrome c, which would otherwise trigger cell death.',
      'Bcl-xS (short) is pro-apoptotic. It is a smaller protein that lacks a key domain found in Bcl-xL, and actively promotes apoptosis, in part by inhibiting the protective effect of Bcl-xL.',
      'The ratio of Bcl-xL to Bcl-xS in a cell is a critical switch that determines its susceptibility to apoptotic signals: a high ratio favours survival, while a low ratio sensitises the cell to death.',
      'Many genes involved in apoptosis produce one isoform that promotes cell death and another that protects the cell, and the balance between them can determine the cell’s fate.',
      'The structure is human Bcl-xL, a bundle of helices; a long, flexible loop near its start is unresolved.'
    ]},
  {id:'ejc',group:'alternative',name:'Exon junction complex',symbol:null,gene:null,
    short:'Left on the mRNA where exons were joined',
    notes:'functional-consequences-of-alternative-splicing',
    related:['camkii','bclxl','eif4e'],
    aka:['EJC'],
    facts:[
      'Alternative splicing can also control the abundance of an mRNA. Sometimes splicing includes an exon that contains a premature stop codon, which targets the mRNA for rapid degradation and so reduces the amount of protein produced.',
      'This mechanism is a way to fine-tune gene expression levels, similar to transcriptional regulation.',
      'Splicing leaves a complex of proteins, the exon junction complex, on the mRNA just upstream of each junction where exons were joined.',
      'A stop codon is recognised as premature when translation ends before a junction still marked by this complex, and the mRNA is then degraded.',
      'The structure is the core of the human exon junction complex, eIF4AIII, MAGOH, Y14 and part of Barentsz, on a stretch of RNA.'
    ]}
];

/* Accuracy notes (kept off screen):
   - Facts beyond the notes, kept minimal: eIF4E as the cap-binding protein of eIF4F; CBP20 holding the cap; the
     U4/U6 snRNAs base paired (as the snRNPs scene says); U2AF's two subunits and U2AF35 at the AG; SR proteins absent
     from S. cerevisiae specifically (the notes say "yeast"); the exon junction complex and how it marks a premature
     stop codon; Dbr1's branched-RNA chemistry; CaMKIIδ as a twelve-subunit holoenzyme; Bcl-xL as a helical bundle.
   - Sm ring: the notes count eight Sm proteins (Lewin counts B and its splice variant B′); the ring has seven.
   - The spliceosome's mass is given as in the notes' figure (about 12 MDa); the notes' "50S–60S" is left out.
   - The capping enzyme's structure resolves only its guanylyl-transferase part, the GT of the notes. */

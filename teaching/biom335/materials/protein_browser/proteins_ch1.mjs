// Protein browser content for chapter 1, Genes are DNA: groups, then one entry per molecule in display order.
// `notes` is the section id in notes.html; `related` lists other entry ids (here also the bacterial chapter's
// RNA polymerase, `core`, which the notes name as the enzyme of transcription).
export const GROUPS=[
  {id:'nucleic',title:'Nucleic acids',
    intro:'DNA is a double helix of two antiparallel polynucleotide chains held together by base pairing. Base pairing also occurs within single-stranded RNA, and between single strands of DNA and RNA.'},
  {id:'replication',title:'DNA replication',
    intro:'Replication is semiconservative. At the replication fork, DNA polymerases synthesise the daughter strands, assisted by other proteins such as DNA helicase, which unwinds the DNA.'},
  {id:'rna',title:'RNA genomes',
    intro:'Some viruses have genomes of RNA. Most RNA viruses replicate RNA from RNA using an RNA-dependent RNA polymerase; retroviruses instead copy their RNA genome into DNA by reverse transcription.'},
  {id:'transfection',title:'Transfection',
    intro:'When DNA is added to eukaryotic cells growing in culture, it can enter the cells, and some of it may be expressed to produce new proteins, giving the cells a new phenotype.'}
];

export const PROTEINS=[
  {id:'bdna',group:'nucleic',name:'DNA double helix',symbol:null,gene:null,
    short:'Two antiparallel strands · about 10 bp to a turn',
    notes:'dna-is-a-double-helix',
    related:['hybrid','trna','dnapol','helicase'],
    facts:[
      'DNA is a double helix made up of two polynucleotide chains, which run in opposite directions: they are antiparallel.',
      'The two chains associate by hydrogen bonding between their bases. G pairs most stably with C, forming three hydrogen bonds, and A with T, forming two; the paired bases are complementary.',
      'The double helix keeps a constant width because a purine always faces a pyrimidine in the complementary A–T and G–C base pairs.',
      'The sugar–phosphate backbones are on the outside of the helix and carry negative charges on their phosphate groups. In solution the charges are neutralised by metal ions, typically Na⁺; in the cell, positively charged proteins provide some of the neutralising force.',
      'The base pairs are on the inside. They are flat, lie perpendicular to the axis of the helix, and are stacked on one another like a pile of plates, the steps of a spiral staircase.',
      'Each base pair is rotated about 36° around the axis relative to the next, so approximately 10 base pairs make a complete turn.',
      'The twisting of the two strands around each other forms a minor groove about 12 Å (1.2 nm) across and a major groove about 22 Å (2.2 nm) across.',
      'In B-DNA, the form in which DNA is found in the cell, the double helix is right-handed: the turns run clockwise as viewed along the helical axis.',
      'The two strands are joined only by relatively weak hydrogen bonds, so they can separate, and the specificity of base pairing lets each act as the template for the synthesis of the other.',
      'In 1953, Watson and Crick proposed that DNA is a double helix. The X-ray diffraction pattern of DNA captured by Rosalind Franklin and Raymond Gosling provided the crucial evidence.',
      'The structure is a dodecamer of 12 base pairs, CGCGAATTCGCG: a little more than one turn of the helix.'
    ]},
  {id:'trna',group:'nucleic',name:'Transfer RNA',symbol:null,gene:null,
    short:'One RNA strand folded by base pairing within itself',
    notes:'nucleic-acids-hybridise-by-base-pairing',
    related:['hybrid','bdna','rdrp'],
    aka:['tRNA'],
    facts:[
      'Base pairing occurs not only in duplex DNA but also in intramolecular interactions within single-stranded RNA, where one stretch of the strand pairs with another.',
      'The ability to form base pairs is essential for the activity of a single-stranded nucleic acid, whereas disruption of the hydrogen bonds that form base pairs is crucial to the function of a double-stranded one.',
      'RNA’s sugar is ribose, which carries a hydroxyl group (–OH) on its 2′ carbon where DNA’s deoxyribose has none. RNA has uracil (U) in place of thymine.',
      'Not all RNAs code for a protein. Non-coding RNAs, the products of non-protein-coding genes, have many different functions in the cell; transfer RNA is one of them.',
      'The structure is yeast phenylalanine tRNA: a single chain of 76 nucleotides, folded into an L shape by base pairing between its own stretches.'
    ]},
  {id:'hybrid',group:'nucleic',name:'DNA–RNA hybrid',symbol:null,gene:null,
    short:'A DNA strand base paired with an RNA strand',
    notes:'nucleic-acids-hybridise-by-base-pairing',
    related:['bdna','trna','rt'],
    aka:['DNA–RNA heteroduplex'],
    facts:[
      'Single-stranded DNA and single-stranded RNA can base pair to form a double-stranded structure, a DNA–RNA heteroduplex.',
      'Base pairing is generally between complementary strands of the same nucleic acid, as in duplex DNA, but complementary strands of DNA and RNA can also pair with each other.',
      'The concept of base pairing is central to all processes involving nucleic acids.',
      'Disruption of the hydrogen bonds that form base pairs is crucial to the function of a double-stranded nucleic acid, whereas the ability to form base pairs is essential for the activity of a single-stranded one.',
      'The structure pairs ten nucleotides of RNA, UUCGGGCGCC, with the complementary DNA strand, GGCGCCCGAA; the RNA’s uracils pair with the DNA’s adenines.'
    ]},
  {id:'dnapol',group:'replication',name:'DNA polymerase',symbol:null,gene:null,
    short:'Adds nucleotides to a new DNA strand on its template',
    notes:'polymerases-act-on-separated-dna-strands-at-the-replication-fork',
    related:['helicase','rt','rdrp','core'],
    facts:[
      'DNA polymerases recognise the template strand and catalyse the addition of nucleotide subunits to the polynucleotide chain being synthesised.',
      'Replication is semiconservative: each separated parental strand acts as the template for a new strand, so each daughter duplex consists of one parental strand and one newly synthesised strand.',
      'Polymerases act on separated DNA strands at the replication fork, a small region of denatured duplex that moves along the parental DNA and exposes both parental strands as templates.',
      'DNA polymerase adds nucleotides only to a 3′ end, so a new strand grows only in the 5′ to 3′ direction.',
      'Because the two parental strands are antiparallel, one daughter strand, the leading strand, is made continuously as the fork moves, while the other, the lagging strand, is made in short pieces, Okazaki fragments, that are later joined.',
      'DNA polymerases are assisted by a number of other proteins, such as DNA helicase, which unwinds the DNA.',
      'An error during replication can insert the wrong base into a polynucleotide, one of the two ways a point mutation arises.',
      'The structure is the DNA polymerase of bacteriophage T7, bound to thioredoxin, a protein of its host E. coli, on a new strand paired with its template strand.'
    ]},
  {id:'helicase',group:'replication',name:'DNA helicase',symbol:null,gene:null,
    short:'Unwinds the DNA at the replication fork',
    notes:'polymerases-act-on-separated-dna-strands-at-the-replication-fork',
    related:['dnapol','bdna'],
    facts:[
      'DNA helicase is one of the proteins that assist DNA polymerases in replication: it unwinds the DNA.',
      'Replication needs the two strands to be separated. This is denaturation, the disruption of the duplex; because the strands are held together by base-specific pairing, it is reversible, and the reverse is renaturation.',
      'Only a small region of the duplex is denatured at any time during replication: the replication fork, which moves along the parental duplex, exposing both parental strands as templates for the synthesis of two daughter strands.',
      'The two strands can separate because they are joined only by relatively weak hydrogen bonds.',
      'The structure is the helicase of bacteriophage T7: a ring of subunits around a single strand of DNA, which runs through its centre.'
    ]},
  {id:'rdrp',group:'rna',name:'RNA-dependent RNA polymerase',symbol:null,gene:null,
    short:'Copies RNA from an RNA template',
    notes:'genetic-information-can-be-provided-by-dna-or-rna',
    related:['rt','dnapol','core','trna'],
    facts:[
      'Most RNA viruses replicate RNA from RNA using an RNA-dependent RNA polymerase.',
      'In some viruses the genome is made of double-stranded or single-stranded RNA. No cellular organism has been found to have a genome made of anything other than double-stranded DNA.',
      'In cells, RNAs are generally transcribed from DNA by RNA polymerase. RNA-virus genomes can instead be copied from RNA.',
      'Information in nucleic acid can be perpetuated or transferred, but the transfer of information into a polypeptide is irreversible. RNA replication, like DNA replication, perpetuates it.',
      'The structure is the polymerase of poliovirus, an RNA virus, copying an RNA template into a new RNA strand.'
    ]},
  {id:'rt',group:'rna',name:'Reverse transcriptase',symbol:null,gene:null,
    short:'Copies an RNA genome into DNA',
    notes:'genetic-information-can-be-provided-by-dna-or-rna',
    related:['rdrp','dnapol','hybrid'],
    facts:[
      'Retroviruses copy their RNA genome into DNA by reverse transcription, which is carried out by reverse transcriptase.',
      'Reverse transcription is the process by which RNA is used as a template to produce DNA. It is used by retroviruses and other reverse-transcribing viruses.',
      'It transfers information from RNA back to DNA. Information in nucleic acid can be perpetuated or transferred, but the transfer of information from the polypeptide level back to the nucleotide level does not occur in nature.',
      'The structure is the reverse transcriptase of HIV-1, a retrovirus, made of two subunits, p66 and p51, on an RNA template paired with the new DNA strand it is making.'
    ]},
  {id:'tk',group:'transfection',name:'Thymidine kinase',symbol:null,gene:null,
    short:'Required for DNA synthesis · its gene is transfected',
    notes:'evidence-for-dna-as-the-genetic-material-of-eukaryotes',
    related:['dnapol'],
    aka:['TK'],
    facts:[
      'The thymidine kinase (TK) gene is required for DNA synthesis. Cells that lack the TK gene cannot produce thymidine kinase.',
      'Cells deficient for the thymidine kinase gene can be rescued by adding a plasmid containing the thymidine kinase gene: some cells take up the TK gene, and the descendants of each transfected cell pile up into a colony.',
      'Under selection, the surviving cells can proliferate, showing that introduced genetic information can be maintained through cell division in this stable-transfection experiment.',
      'Transfected DNA may be expressed transiently without integration; in stable transfection, selected DNA is maintained through cell division, usually after integration into the genome.',
      'Transfection is analogous to the transformation of bacteria. For historical reasons, adding DNA to a bacterium is called transformation, and adding DNA to a eukaryotic cell transfection.',
      'The structure is human thymidine kinase 1, made of four identical subunits.'
    ]}
];

/* Accuracy notes (kept off screen):
   - Where the source text says little about a molecule, its entry keeps to what it says; the last fact of each
     entry describes the structure shown, which each card credits. Facts beyond the source text: tRNA as a
     non-coding RNA folded by intramolecular pairing (the source text shows an RNA hairpin, not a tRNA); T7's
     DNA polymerase working with host thioredoxin; the T7 helicase as a ring round one strand; poliovirus as an
     RNA virus; HIV-1 as a retrovirus with a two-subunit (p66, p51) reverse transcriptase; human TK1 as four
     subunits.
   - Thymidine kinase: "required for DNA synthesis" is the source text's wording. Strictly, TK lets cells make
     DNA from thymidine (the salvage route); TK-deficient cells die only under selection that blocks the
     de novo route (HAT medium), which is why the rescue works "under selection".
   - The helicase structure (6N7I) resolves five of the T7 ring's subunits fully and a short helix of the sixth,
     so its entry says "a ring of subunits" rather than a number.
   - The DNA polymerase entry's leading/lagging-strand facts follow the source text's replication-fork section. */

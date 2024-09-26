/* eslint import/no-anonymous-default-export: [2, {"allowArray": true}] */
export default [
  {
    name: "Product MercadoLibre",
    desc: "This is your AI-powered MercadoLibre expert, creating captivating and keyword-rich Marketplace product descriptions to boost your online sales.",
    icon: "/icons/mercadolibre-white.svg",
    category: "Marketing",

    slug: "marketplace-product-description",
    aiPrompt: `- **ERES** un **REDACTOR PUBLICITARIO EXPERTO** en la venta de productos en marketplaces como Amazon y Mercado Libre. 
    
    (Contexto: "Tu habilidad para crear descripciones motivadoras y persuasivas es clave para incrementar las ventas y atraer a más compradores.")
    ## Descripción de la Tarea

    - **TU TAREA ES** **DESARROLLAR** descripciones de producto basadas en el productName y outline  proporcionada por el usuario y si existen las imágenes del producto que te serán compartidas.

    (Contexto: "Estas descripciones deben captar la atención del comprador, destacar los beneficios clave y convertir visitas en ventas.")

    ## Instrucciones de Redacción

    1. **REVISA** las imágenes del producto proporcionadas antes de desarrollar la descripción para asegurar que el texto refleje visualmente lo que el comprador verá.

    2. **CREA** una descripción clara y directa, organizada en **pocos párrafos**.

    3. **DESTACA** los **beneficios** del producto en los primeros párrafos, enfocándote en lo que más valora el comprador.

    4. **INCLUYE** gatillos mentales y **llamadas a la acción** entre el segundo y tercer párrafo para motivar la compra.

    5. **FINALIZA** la descripción con una **lista de características relevantes** del producto, asegurándote de que sea precisa y concisa.

    6. **UTILIZA** un tono persuasivo, asegurándote de que el contenido sea atractivo y relevante.

    7. **ESPERA** la orden del usuario para proceder con la redacción después de que te proporcione los datos específicos del producto y las imágenes correspondientes.

    ## Resultados Esperados

    - **PROPORCIONA** una descripción de producto bien estructurada que aumente la probabilidad de conversión.

    - **ASEGURA** que las llamadas a la acción sean claras y efectivas, guiando al comprador hacia la decisión de compra.

    - **INCLUYE** una lista de características que resalte los aspectos más importantes del producto.

    (Contexto: "Una descripción efectiva es clave para destacar en marketplaces competitivos y mejorar las tasas de conversión.")

    ## IMPORTANTE

    - "Tu habilidad en la redacción puede marcar la diferencia entre una venta exitosa y una oportunidad perdida. ¡Hagamos que cada palabra cuente!"

    - "Recuerda, tu descripción es la primera impresión que el comprador tendrá del producto. ¡Asegúrate de que sea memorable!"
    `,
    form: [
      {
        label: "Product Name",
        field: "input",
        name: "productName",
        required: true,
      },
      {
        label: "Product Details",
        field: "textarea",
        name: "outline",
        required: true,
      },
    ],
  },
  {
    name: "Content Strategy Plan",
    desc: "Create a comprehensive content strategy plan tailored to your business goals, audience, and niche.",
    category: "marketing-strategy",
    icon: "/icons/strategy-development.png",
    aiPromt:
      "Generate a detailed content strategy plan for the given business goals, audience, and niche. Include content types, channels, frequency, and KPIs. Output in rich text editor format.",
    slug: "content-strategy-plan",
    form: [
      {
        label: "Enter your business goals",
        field: "textarea",
        name: "businessGoals",
        required: true,
      },
      {
        label: "Enter your target audience",
        field: "textarea",
        name: "targetAudience",
        required: true,
      },
      {
        label: "Enter your niche",
        field: "input",
        name: "niche",
        required: true,
      },
    ],
  },
  {
    name: "Customer Persona Builder",
    desc: " Develop detailed customer personas to better understand and target your ideal audience.",
    category: "research",
    icon: "/icons/persona.png",
    aiPromt:
      "Generate customer personas based on the provided demographic data, behavior, and goals. Output in rich text editor format.",
    slug: "customer-persona-builder",
    form: [
      {
        label: "Enter demographic data",
        field: "textarea",
        name: "demographicData",
        required: true,
      },
      {
        label: "Describe customer behavior",
        field: "textarea",
        name: "behavior",
        required: true,
      },
      {
        label: "Enter customer goals",
        field: "textarea",
        name: "goals",
        required: true,
      },
    ],
  },
  {
    name: "Brand Voice Guide",
    desc: "Establish a consistent and distinctive brand voice that resonates with your audience.",
    category: "branding",
    icon: "/icons/brand-voice.png",
    aiPromt:
      "Create a brand voice guide based on the provided brand attributes, audience, and desired tone. Output in rich text editor format.",
    slug: "brand-voice-guide",
    form: [
      {
        label: "Enter your brand attributes",
        field: "textarea",
        name: "brandAttributes",
        required: true,
      },
      {
        label: "Describe your target audience",
        field: "textarea",
        name: "targetAudience",
        required: true,
      },
      {
        label: "Enter the desired tone",
        field: "input",
        name: "tone",
        required: true,
      },
    ],
  },
  {
    name: "Brand Positioning Statement",
    desc: "Develop a clear and compelling brand positioning statement that defines your brand's unique value.",
    category: "branding",
    icon: "/icons/brand-statement.png",
    aiPromt:
      "Create a brand positioning statement based on the provided brand attributes, target market, and competitive advantage.Output in rich text editor format.",
    slug: "brand-positioning-statement",
    form: [
      {
        label: "Enter your brand attributes",
        field: "textarea",
        name: "brandAttributes",
        required: true,
      },
      {
        label: "Enter your target market",
        field: "input",
        name: "targetMarket",
        required: true,
      },
      {
        label: "Enter your competitive advantage",
        field: "textarea",
        name: "competitiveAdvantage",
        required: true,
      },
    ],
  },
  {
    name: "Content Calendar Generator",
    desc: "Automatically generate a monthly content calendar with topics, formats, and publishing dates.",
    category: "social",
    icon: "/icons/social-calendar.png",
    aiPromt:
      "Generate a detailed social media content calendar for Facebook and TikTok for the next month based on the provided niche, content goals and content strategy. Include post topics, captions, and target audience. Output in rich text editor format.",
    slug: "social-content-calendar",
    form: [
      {
        label: "Enter your content niche",
        field: "input",
        name: "niche",
        required: true,
      },
      {
        label: "Enter your content goals",
        field: "textarea",
        name: "contentGoals",
        required: true,
      },
      {
        label: "Enter your target audience",
        field: "textarea",
        name: "targetAudience",
        required: true,
      },
    ],
  },
  {
    name: "Podcast Episode Ideas",
    desc: "Generate creative and engaging podcast episode ideas tailored to your niche.",
    category: "podcast",
    icon: "/icons/script.png",
    aiPromt:
      "Generate 5 podcast episode ideas based on the provided niche. Include brief descriptions for each episode. Output in rich text editor format.",
    slug: "podcast-episode-ideas",
    form: [
      {
        label: "Enter your podcast niche",
        field: "input",
        name: "niche",
        required: true,
      },
    ],
  },
  {
    name: "Blog Title",
    desc: "An Ai tool that generates blog title depending on your blog interest ",
    category: "blog",
    icon: "/icons/title.png",
    aiPromt:
      "Generate 5 blog title ideas based on the provided niche and outline. Ensure the titles are catchy, SEO-friendly, and tailored to the target audience. Output in rich text editor format.",
    slug: "generate-blog-title",
    form: [
      {
        label: "Enter your blog niche",
        field: "input",
        name: "niche",
        required: true,
      },
      {
        label: "Enter blog outline",
        field: "textarea",
        name: "outline",
      },
    ],
  },
  {
    name: "Blog Content",
    desc: "An Ai tool that generates blog content depending on your blog interest ",
    category: "blog",
    icon: "/icons/blog.png",
    aiPromt:
      "Generate comprehensive and engaging blog content based on the provided topic and outline. Include headings, subheadings, and structured paragraphs, ensuring the content is SEO-optimized. Output in rich text editor format.",
    slug: "generate-blog-content",
    form: [
      {
        label: "Enter your blog topic",
        field: "input",
        name: "topic",
        required: true,
      },
      {
        label: "Enter blog outline",
        field: "textarea",
        name: "outline",
      },
    ],
  },
  {
    name: "Blog Topic Ideas",
    desc: "An Ai tool that serves as you personal blog post title ",
    category: "blog",
    icon: "/icons/topic.png",
    aiPromt:
      "Generate 5 unique blog topic ideas based on the provided niche. Ensure each idea is relevant, engaging, and suitable for the target audience. Output in rich text editor format.",
    slug: "generate-blog-topic-ideas",
    form: [
      {
        label: "Enter your Niche",
        field: "input",
        name: "niche",
        required: true,
      },
    ],
  },
  {
    name: "YouTube SEO title",
    desc: "An Ai tool that generates YouTube SEO friendly titles depending on your blog interest ",
    category: "youtube",
    icon: "/icons/play.png",
    aiPromt:
      "Generate 5 SEO-optimized YouTube title ideas based on the provided keywords and outline. Ensure the titles are catchy, high-ranking, and tailored for the target audience. Output in HTML tags format.",
    slug: "generate-youtube-seo-title",
    form: [
      {
        label: "Enter your YouTube video topic keywords",
        field: "input",
        name: "keywords",
        required: true,
      },
      {
        label: "Enter your YouTube description outline here",
        field: "textarea",
        name: "outline",
      },
    ],
  },
  {
    name: "YouTube Description",
    desc: "An Ai tool that generates YouTube SEO friendly video descriptions depending on your blog topic ",
    category: "youtube",
    icon: "/icons/description.png",
    aiPromt:
      "Generate a concise and engaging YouTube video description with relevant emojis, based on the provided topic and outline. Ensure the description is optimized for SEO and fits within 4-5 lines. Output in rich text editor format.",
    slug: "generate-youtube-seo-description",
    form: [
      {
        label: "Enter your YouTube video topic/title",
        field: "input",
        name: "topic",
        required: true,
      },
      {
        label: "Enter your YouTube outline here",
        field: "textarea",
        name: "outline",
      },
    ],
  },
  {
    name: "YouTube Tags",
    desc: "An Ai tool that generates YouTube video tags depending on your blog topic ",
    category: "youtube",
    icon: "/icons/tags.png",
    aiPromt:
      "Generate 10 relevant and high-ranking YouTube tags based on the provided title and outline. Ensure the tags are optimized for search and related to the content. Output in rich text editor format.",
    slug: "generate-youtube-tags",
    form: [
      {
        label: "Enter your YouTube video title",
        field: "input",
        name: "title",
        required: true,
      },
      {
        label: "Enter your YouTube outline here (optional)",
        field: "textarea",
        name: "outline",
      },
    ],
  },
  {
    name: "Rewrite Article (Plagiarism Free)",
    desc: "Use this tool to rewrite existing Article or Blog Post",
    category: "rewrite",
    icon: "/icons/plagiarism.png",
    aiPromt:
      "Rewrite the provided article or blog post to ensure it is plagiarism-free and can bypass AI detectors. Maintain the original meaning while enhancing readability and SEO. Output in rich text editor format.",
    slug: "rewrite-article",
    form: [
      {
        label: "Enter your Niche",
        field: "textarea",
        name: "article",
        required: true,
      },
    ],
  },
  {
    name: "Text Improver",
    desc: "This handy tools refines your writing, eliminating grammar and spelling errors",
    category: "rewrite",
    icon: "/icons/book.png",
    aiPromt:
      "Improve the provided text textToImprove by correcting grammar, enhancing clarity, and refining tone. Ensure the text is professional and free of errors. Output in rich text editor format.",
    slug: "text-improver",
    form: [
      {
        label: "Enter your text",
        field: "textarea",
        name: "textToImprove",
      },
    ],
  },
  {
    name: "Add Emojis to text",
    desc: "This handy tools makes your text pop! using emojis.",
    category: "rewrite",
    icon: "/icons/add.png",
    aiPromt:
      "Enhance the provided text by adding relevant emojis to improve engagement and readability. Ensure the emojis match the tone and context. Output in rich text editor format.",
    slug: "add-emojis-to-text",
    form: [
      {
        label: "Enter your text to add emojis",
        field: "textarea",
        name: "outline",
        required: true,
      },
    ],
  },
  {
    name: "Instagram Post Generator",
    desc: "Generate amazing engaging Instagram post",
    category: "social",
    icon: "/icons/post.png",
    aiPromt:
      "Generate 3 creative Instagram post ideas based on the provided keywords. Ensure each post is engaging, on-trend, and includes appropriate captions and hashtags. Output in rich text editor format.",
    slug: "generate-instagram-post",
    form: [
      {
        label: "Enter your keywords for your post",
        field: "input",
        name: "keywords",
        required: true,
      },
    ],
  },
  {
    name: "Instagram Hashtag Generator",
    desc: "Generate amazing popular Instagram Hashtags",
    category: "social",
    icon: "/icons/hashtag.png",
    aiPromt:
      "Generate 15 relevant and trending Instagram hashtags based on the provided keywords. Ensure the hashtags are optimized for reach and engagement. Output in rich text editor format.",
    slug: "generate-instagram-hashtags",
    form: [
      {
        label: "Enter your keywords for your hashtags",
        field: "input",
        name: "keywords",
        required: true,
      },
    ],
  },
  {
    name: "Instagram Post/Reel Idea",
    desc: "An AI tool that generate New and trending Instagram idea depends on your niche",
    icon: "/icons/insta-ideas.png",
    category: "instagram",

    slug: "instagram-post-idea-generator",
    aiPrompt:
      "Generate 5-10 Instagram idea depends on niche with latest trend and give output in  in rich text editor format",
    form: [
      {
        label: "Enter Keywords / Niche for your Instagram idea",
        field: "input",
        name: "keywords",
        required: true,
      },
    ],
  },
  {
    name: "English grammar Check",
    desc: "AI Model to Correct your english grammar by providing the text",
    icon: "/icons/grammer.png",
    category: "english",

    slug: "english-grammar-checker",
    aiPrompt:
      "Rewrite the inputText by correcting the grammar and give output in  in rich text editor format",
    form: [
      {
        label: "Enter text to correct the grammar",
        field: "input",
        name: "inputText",
        required: true,
      },
    ],
  },
  {
    name: "Tagline Generator",
    desc: "Struggling to find the perfect tagline for your brand? Let our AI-tool assist you in creating a tagline that stands out.",
    icon: "/icons/tagline.png",
    category: "Marketing",

    slug: "tagline-generator",
    aiPrompt:
      "Depends on user productName and outline generate catchy 5-10 tagline for the business product and give output  in rich text editor format ",
    form: [
      {
        label: "Product/Brand Name",
        field: "input",
        name: "productName",
        required: true,
      },
      {
        label: "What you are selling / Marketing",
        field: "textarea",
        name: "outline",
        required: true,
      },
    ],
  },
  {
    name: "Competitive Analysis Report",
    desc: "Generate a competitive analysis report that highlights your competitors' strengths and weaknesses.",
    category: "research",
    icon: "/icons/analysis.png",
    aiPromt:
      "Create a competitive analysis report based on the provided competitors, market, and business goals.. Output in rich text editor format.",
    slug: "competitive-analysis-report",
    form: [
      {
        label: "Enter your competitors",
        field: "textarea",
        name: "brandAttributes",
        required: true,
      },
      {
        label: "Describe your market",
        field: "textarea",
        name: "market",
        required: true,
      },
      {
        label: "Enter your business goals",
        field: "textarea",
        name: "businessGoals",
        required: true,
      },
    ],
  },
  {
    name: "Product Description",
    desc: "This is your AI-powered SEO expert, creating captivating and keyword-rich e-commerce product descriptions to boost your online sales.",
    icon: "/icons/product.png",
    category: "Marketing",

    slug: "product-description",
    aiPrompt:
      "Depends on user productName and description generate small description for product for e-commer business give output  in rich text editor format  ",
    form: [
      {
        label: "Product Name",
        field: "input",
        name: "productName",
        required: true,
      },
      {
        label: "Product Details",
        field: "textarea",
        name: "outline",
        required: true,
      },
    ],
  },
];

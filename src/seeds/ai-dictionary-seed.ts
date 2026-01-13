/**
 * AI Dictionary Seed - Terms from rundown.ai/ai-dictionary
 * Simplified structure matching frontend form
 */

import mongoose from 'mongoose';
import { DictionaryTerm } from '../models/dictionary.model';
import dotenv from 'dotenv';

dotenv.config();

const aiDictionaryData = [
  // === A ===
  {
    term: 'AGI',
    slug: 'agi',
    synonym: 'Artificial General Intelligence',
    definition: 'AI giả định có khả năng hiểu, học và thích nghi với mọi nhiệm vụ trí tuệ mà con người có thể thực hiện.',
    description: '<p>AGI (Artificial General Intelligence - Trí tuệ nhân tạo tổng quát) là mục tiêu cuối cùng của nghiên cứu AI. Khác với AI hẹp chỉ giỏi một nhiệm vụ cụ thể, AGI có thể tự học và giải quyết mọi vấn đề như con người.</p>',
    examples: ['Hiện tại chưa có hệ thống AGI nào được tạo ra thành công.', 'OpenAI và DeepMind đều đang nghiên cứu hướng tới AGI.'],
    relatedTerms: ['AI', 'Machine Learning', 'Deep Learning'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'AI',
    slug: 'ai',
    synonym: 'Trí tuệ nhân tạo',
    definition: 'Hệ thống thực hiện các nhiệm vụ trí tuệ như con người bằng cách học từ dữ liệu thay vì lập trình cứng.',
    description: '<p>AI (Artificial Intelligence) bao gồm machine learning, deep learning, xử lý ngôn ngữ tự nhiên và nhiều lĩnh vực khác. AI hiện đại dựa trên neural networks và học từ lượng dữ liệu khổng lồ.</p>',
    examples: ['ChatGPT là một ứng dụng AI chatbot phổ biến.', 'AI đang được ứng dụng trong y tế, tài chính, giao thông.'],
    relatedTerms: ['Machine Learning', 'Deep Learning', 'LLM'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'AI Agent',
    slug: 'ai-agent',
    synonym: 'Tác tử AI',
    definition: 'Phần mềm nhận biết môi trường, chọn hành động để đạt mục tiêu và thực thi chúng trong các chu kỳ lặp lại.',
    description: '<p>AI Agent là bước tiến từ chatbot đơn giản. Agent có khả năng tự động hóa workflow, gọi API, thực thi code và hoàn thành các tác vụ phức tạp mà không cần can thiệp liên tục của người dùng.</p>',
    examples: ['Claude Computer Use cho phép AI điều khiển máy tính.', 'AutoGPT là một dự án AI agent open-source.'],
    relatedTerms: ['AI Assistant', 'Tool Use', 'MCP'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'AI Assistant',
    slug: 'ai-assistant',
    synonym: 'Trợ lý AI',
    definition: 'Giao diện hội thoại giúp người dùng thông qua trả lời câu hỏi, soạn nội dung, vận hành ứng dụng và tự động hóa tác vụ.',
    description: '<p>AI Assistant như ChatGPT, Claude, Gemini giúp người dùng tương tác bằng ngôn ngữ tự nhiên để hoàn thành công việc từ đơn giản đến phức tạp.</p>',
    examples: ['Siri, Alexa là các AI assistant phổ biến.', 'Claude có thể hỗ trợ viết code, phân tích dữ liệu.'],
    relatedTerms: ['Chatbot', 'Conversational AI', 'AI Agent'],
    isActive: true,
    isFeatured: false,
  },
  {
    term: 'AI Safety',
    slug: 'ai-safety',
    synonym: 'An toàn AI',
    definition: 'Nghiên cứu đảm bảo các hệ thống AI tiên tiến luôn phù hợp với giá trị con người và có thể kiểm soát được.',
    description: '<p>AI Safety là lĩnh vực quan trọng khi AI ngày càng mạnh mẽ. Bao gồm alignment, interpretability, robustness và các phương pháp đảm bảo AI không gây hại.</p>',
    examples: ['Anthropic tập trung vào Constitutional AI để đảm bảo an toàn.', 'RLHF là phương pháp phổ biến để align AI với con người.'],
    relatedTerms: ['Alignment', 'AI Ethics', 'RLHF'],
    isActive: true,
    isFeatured: false,
  },
  {
    term: 'Algorithm',
    slug: 'algorithm',
    synonym: 'Thuật toán',
    definition: 'Quy trình tính toán từng bước; trong ML, xác định cách mô hình học từ dữ liệu.',
    description: '<p>Thuật toán là nền tảng của mọi chương trình máy tính. Trong machine learning, các thuật toán như gradient descent, backpropagation quyết định cách model học và cải thiện.</p>',
    examples: ['Thuật toán sắp xếp QuickSort có độ phức tạp O(n log n).', 'Gradient descent là thuật toán tối ưu hóa cơ bản trong deep learning.'],
    relatedTerms: ['Machine Learning', 'Gradient Descent', 'Neural Network'],
    isActive: true,
    isFeatured: false,
  },
  {
    term: 'Alignment',
    slug: 'alignment',
    synonym: 'Căn chỉnh AI',
    definition: 'Đảm bảo hệ thống AI theo đuổi mục tiêu con người mong muốn trong khi tôn trọng các ràng buộc.',
    description: '<p>Alignment problem là thách thức lớn trong AI safety. Làm sao để AI hiểu đúng ý định con người và không tìm cách "hack" mục tiêu theo cách không mong muốn.</p>',
    examples: ['RLHF giúp align model với sở thích của người dùng.', 'Constitutional AI của Anthropic là approach mới cho alignment.'],
    relatedTerms: ['AI Safety', 'RLHF', 'AI Ethics'],
    isActive: true,
    isFeatured: false,
  },
  {
    term: 'Anthropic',
    slug: 'anthropic',
    definition: 'Phòng thí nghiệm AI nổi tiếng với các mô hình Claude và phương pháp Constitutional AI.',
    description: '<p>Anthropic được thành lập bởi các cựu nhân viên OpenAI, tập trung vào AI safety research. Claude là sản phẩm flagship của họ.</p>',
    examples: ['Claude 3.5 Sonnet là model mạnh nhất của Anthropic.', 'Anthropic nhận đầu tư từ Google và Amazon.'],
    relatedTerms: ['Claude', 'Constitutional AI', 'OpenAI'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'API',
    slug: 'api',
    synonym: 'Application Programming Interface',
    definition: 'Quy tắc cho phép các chương trình giao tiếp, giúp developers thêm khả năng AI vào ứng dụng.',
    description: '<p>API là cầu nối giữa các phần mềm. OpenAI API, Anthropic API cho phép developers tích hợp AI vào sản phẩm của mình một cách dễ dàng.</p>',
    examples: ['OpenAI cung cấp API để sử dụng GPT-4.', 'REST API và GraphQL là hai chuẩn phổ biến.'],
    relatedTerms: ['SDK', 'Integration', 'Tool Use'],
    isActive: true,
    isFeatured: false,
  },
  {
    term: 'Attention Mechanism',
    slug: 'attention-mechanism',
    synonym: 'Cơ chế chú ý',
    definition: 'Thành phần neural đánh giá token đầu vào nào quan trọng nhất ở mỗi bước.',
    description: '<p>Attention là đột phá quan trọng nhất trong NLP hiện đại. Self-attention trong Transformers cho phép model xem xét toàn bộ context khi xử lý mỗi token.</p>',
    examples: ['Transformer architecture dựa hoàn toàn vào self-attention.', 'Multi-head attention cho phép model học nhiều patterns cùng lúc.'],
    relatedTerms: ['Transformer', 'Self-Attention', 'Neural Network'],
    isActive: true,
    isFeatured: true,
  },

  // === B ===
  {
    term: 'Benchmark',
    slug: 'benchmark',
    synonym: 'Điểm chuẩn',
    definition: 'Bộ dữ liệu và metric chuẩn hóa để so sánh hiệu suất các mô hình.',
    description: '<p>Benchmarks như MMLU, HumanEval, GSM8K được dùng để đánh giá và so sánh các LLM. Tuy nhiên, benchmark không phản ánh hoàn toàn khả năng thực tế.</p>',
    examples: ['GPT-4 đạt điểm cao trên benchmark MMLU.', 'HumanEval đo khả năng coding của model.'],
    relatedTerms: ['Evaluation', 'SOTA', 'Model'],
    isActive: true,
    isFeatured: false,
  },
  {
    term: 'Bias',
    slug: 'bias',
    synonym: 'Thiên kiến',
    definition: 'Độ lệch có hệ thống, không công bằng trong outputs được thừa kế từ dữ liệu training không cân bằng.',
    description: '<p>Bias trong AI là vấn đề nghiêm trọng. Model có thể phân biệt đối xử theo giới tính, chủng tộc nếu training data có bias. Cần các phương pháp debiasing.</p>',
    examples: ['Facial recognition có thể có bias với người da màu.', 'Hiring AI có thể thiên vị nam giới nếu data lịch sử thiên lệch.'],
    relatedTerms: ['AI Ethics', 'Training Data', 'Fairness'],
    isActive: true,
    isFeatured: false,
  },

  // === C ===
  {
    term: 'Chain-of-Thought',
    slug: 'chain-of-thought',
    synonym: 'CoT',
    definition: 'Kỹ thuật prompting yêu cầu model trình bày các bước suy luận trước khi đưa ra câu trả lời cuối cùng.',
    description: '<p>Chain-of-Thought prompting cải thiện đáng kể khả năng reasoning của LLM. Thay vì trả lời ngay, model sẽ "nghĩ từng bước" giống con người.</p>',
    examples: ['Thêm "Let\'s think step by step" vào prompt là CoT đơn giản nhất.', 'o1 của OpenAI sử dụng CoT nâng cao cho reasoning tasks.'],
    relatedTerms: ['Prompt Engineering', 'Reasoning', 'LLM'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'ChatGPT',
    slug: 'chatgpt',
    definition: 'Giao diện hội thoại của OpenAI trả lời câu hỏi và thực thi các tác vụ.',
    description: '<p>ChatGPT ra mắt tháng 11/2022 đã tạo nên làn sóng AI toàn cầu. Sử dụng các model GPT và được fine-tune bằng RLHF để trở nên helpful và safe.</p>',
    examples: ['ChatGPT đạt 100 triệu người dùng trong 2 tháng.', 'ChatGPT Plus sử dụng GPT-4 với giá $20/tháng.'],
    relatedTerms: ['GPT', 'OpenAI', 'LLM'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'Claude',
    slug: 'claude',
    definition: 'Mô hình ngôn ngữ lớn của Anthropic được thiết kế theo nguyên tắc helpful, harmless.',
    description: '<p>Claude nổi bật với khả năng xử lý context dài (200K tokens), coding mạnh và tuân thủ hướng dẫn tốt. Claude 3.5 Sonnet được đánh giá là một trong những model tốt nhất.</p>',
    examples: ['Claude 3 Opus là model flagship của Anthropic.', 'Claude có thể đọc và phân tích PDF, hình ảnh.'],
    relatedTerms: ['Anthropic', 'LLM', 'Constitutional AI'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'Classification',
    slug: 'classification',
    synonym: 'Phân loại',
    definition: 'Học có giám sát gán inputs vào các danh mục được định nghĩa trước.',
    description: '<p>Classification là một trong những task cơ bản nhất của ML. Từ spam detection, sentiment analysis đến image classification đều là bài toán classification.</p>',
    examples: ['Email spam filter là bài toán binary classification.', 'ImageNet classification phân loại ảnh vào 1000 categories.'],
    relatedTerms: ['Supervised Learning', 'Clustering', 'Machine Learning'],
    isActive: true,
    isFeatured: false,
  },
  {
    term: 'Computer Vision',
    slug: 'computer-vision',
    synonym: 'Thị giác máy tính',
    definition: 'Lĩnh vực cho phép máy diễn giải dữ liệu hình ảnh.',
    description: '<p>Computer Vision bao gồm image classification, object detection, segmentation, OCR và nhiều task khác. Deep learning đã cách mạng hóa lĩnh vực này.</p>',
    examples: ['Tesla Autopilot sử dụng computer vision.', 'Face ID của iPhone dùng computer vision để nhận diện.'],
    relatedTerms: ['Deep Learning', 'CNN', 'Image Generation'],
    isActive: true,
    isFeatured: false,
  },
  {
    term: 'Context Window',
    slug: 'context-window',
    synonym: 'Cửa sổ ngữ cảnh',
    definition: 'Số token tối đa mà LLM có thể xử lý đồng thời.',
    description: '<p>Context window quyết định độ dài văn bản model có thể "nhớ" trong một cuộc hội thoại. Claude có 200K tokens, GPT-4 Turbo có 128K tokens.</p>',
    examples: ['Claude 3 có context window 200K tokens.', 'Context window lớn hơn cho phép phân tích tài liệu dài.'],
    relatedTerms: ['Token', 'LLM', 'RAG'],
    isActive: true,
    isFeatured: true,
  },

  // === D ===
  {
    term: 'Deep Learning',
    slug: 'deep-learning',
    synonym: 'Học sâu',
    definition: 'Neural networks nhiều lớp học features trực tiếp từ dữ liệu thô.',
    description: '<p>Deep Learning là subset của Machine Learning sử dụng neural networks với nhiều hidden layers. Đây là công nghệ đằng sau các đột phá AI gần đây.</p>',
    examples: ['CNN cho image recognition là deep learning.', 'Transformer architecture đã cách mạng hóa NLP.'],
    relatedTerms: ['Neural Network', 'Machine Learning', 'CNN'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'Diffusion Model',
    slug: 'diffusion-model',
    synonym: 'Mô hình khuếch tán',
    definition: 'Phương pháp generative lặp đi lặp lại khử nhiễu từ noise ngẫu nhiên thành nội dung.',
    description: '<p>Diffusion models là công nghệ đằng sau DALL-E, Midjourney, Stable Diffusion. Học cách reverse quá trình thêm noise vào ảnh.</p>',
    examples: ['Stable Diffusion là open-source diffusion model.', 'Midjourney tạo ra hình ảnh nghệ thuật ấn tượng.'],
    relatedTerms: ['Image Generation', 'Generative AI', 'DALL-E'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'Distillation',
    slug: 'distillation',
    synonym: 'Chưng cất',
    definition: 'Training model "student" nhỏ hơn để bắt chước model "teacher" lớn hơn.',
    description: '<p>Knowledge distillation cho phép tạo model nhỏ, nhanh mà vẫn giữ được phần lớn performance của model lớn. Quan trọng cho deployment.</p>',
    examples: ['DistilBERT nhanh hơn 60% so với BERT gốc.', 'Many API providers dùng distilled models để giảm cost.'],
    relatedTerms: ['Fine-tuning', 'Model', 'Quantization'],
    isActive: true,
    isFeatured: false,
  },

  // === E ===
  {
    term: 'Embedding',
    slug: 'embedding',
    synonym: 'Vector nhúng',
    definition: 'Vector số dày đặc biểu diễn đối tượng sao cho sự tương đồng ngữ nghĩa trở thành độ gần.',
    description: '<p>Embeddings chuyển đổi text, image thành vectors trong không gian nhiều chiều. Semantic search, RAG đều dựa trên embeddings.</p>',
    examples: ['OpenAI text-embedding-3 tạo vectors 3072 chiều.', 'Similar texts có embedding vectors gần nhau.'],
    relatedTerms: ['Vector Database', 'Semantic Search', 'RAG'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'Explainable AI',
    slug: 'explainable-ai',
    synonym: 'XAI',
    definition: 'Các phương pháp làm cho hành vi model có thể đọc được thông qua attributions và rationales.',
    description: '<p>XAI giúp hiểu tại sao AI đưa ra quyết định. Quan trọng trong y tế, tài chính và các lĩnh vực cần accountability.</p>',
    examples: ['LIME và SHAP là tools phổ biến cho XAI.', 'Attention visualization giúp hiểu LLM decisions.'],
    relatedTerms: ['AI Safety', 'Interpretability', 'AI Ethics'],
    isActive: true,
    isFeatured: false,
  },

  // === F ===
  {
    term: 'Fine-tuning',
    slug: 'fine-tuning',
    synonym: 'Tinh chỉnh',
    definition: 'Các bước training ngắn trên dữ liệu domain-specific để điều chỉnh pretrained models.',
    description: '<p>Fine-tuning adapt model đã train trên data general sang task specific. Hiệu quả hơn training from scratch nhiều lần.</p>',
    examples: ['Fine-tune GPT-3.5 trên FAQ để tạo customer support bot.', 'LoRA là phương pháp fine-tuning hiệu quả về resource.'],
    relatedTerms: ['Transfer Learning', 'LoRA', 'Foundation Model'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'Foundation Model',
    slug: 'foundation-model',
    synonym: 'Mô hình nền tảng',
    definition: 'Các mô hình rất lớn được train trên dữ liệu rộng làm nền tảng cho việc điều chỉnh.',
    description: '<p>Foundation models như GPT-4, Claude, LLaMA được train trên lượng data khổng lồ và có thể adapt cho nhiều tasks khác nhau thông qua fine-tuning hoặc prompting.</p>',
    examples: ['GPT-4 là foundation model của OpenAI.', 'LLaMA 3 là open-weight foundation model từ Meta.'],
    relatedTerms: ['LLM', 'Pre-training', 'Fine-tuning'],
    isActive: true,
    isFeatured: false,
  },

  // === G ===
  {
    term: 'Gemini',
    slug: 'gemini',
    definition: 'Mô hình multimodal của Google xử lý text, images, audio và video.',
    description: '<p>Gemini là flagship model của Google, được thiết kế multimodal từ đầu. Có các version Ultra, Pro, Nano cho các use cases khác nhau.</p>',
    examples: ['Gemini Ultra cạnh tranh với GPT-4.', 'Gemini được tích hợp vào Google Workspace.'],
    relatedTerms: ['Multimodal AI', 'Google', 'LLM'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'Generative AI',
    slug: 'generative-ai',
    synonym: 'AI tạo sinh',
    definition: 'Các mô hình học cấu trúc thống kê của dữ liệu để sample nội dung mới.',
    description: '<p>Generative AI tạo ra content mới: text, image, audio, video, code. LLMs, diffusion models đều là generative AI.</p>',
    examples: ['ChatGPT generate text, DALL-E generate images.', 'GitHub Copilot generate code suggestions.'],
    relatedTerms: ['LLM', 'Diffusion Model', 'GAN'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'GAN',
    slug: 'gan',
    synonym: 'Generative Adversarial Network',
    definition: 'Setup hai mô hình nơi generators và discriminators cạnh tranh với nhau.',
    description: '<p>GAN gồm Generator tạo fake samples và Discriminator phân biệt real/fake. Hai networks train adversarially để cải thiện lẫn nhau.</p>',
    examples: ['StyleGAN tạo faces hyperrealistic.', 'Pix2Pix dùng GAN cho image-to-image translation.'],
    relatedTerms: ['Generative AI', 'Deep Learning', 'Image Generation'],
    isActive: true,
    isFeatured: false,
  },
  {
    term: 'GPU',
    slug: 'gpu',
    synonym: 'Graphics Processing Unit',
    definition: 'Bộ xử lý song song cao lý tưởng cho các phép toán deep learning.',
    description: '<p>GPU có hàng nghìn cores xử lý song song, phù hợp với matrix operations trong neural networks. NVIDIA dominates thị trường AI GPU.</p>',
    examples: ['NVIDIA H100 là GPU mạnh nhất cho AI training.', 'Cloud providers như AWS, GCP cho thuê GPU instances.'],
    relatedTerms: ['NVIDIA', 'Training', 'Inference'],
    isActive: true,
    isFeatured: false,
  },
  {
    term: 'GPT',
    slug: 'gpt',
    synonym: 'Generative Pre-trained Transformer',
    definition: 'Series mô hình ngôn ngữ lớn của OpenAI.',
    description: '<p>GPT sử dụng Transformer architecture được pre-train trên lượng text khổng lồ. GPT-4 hiện là model flagship của OpenAI.</p>',
    examples: ['GPT-4 đạt top scores trên nhiều benchmarks.', 'GPT-3.5 powers ChatGPT Free tier.'],
    relatedTerms: ['OpenAI', 'LLM', 'Transformer'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'Gradient Descent',
    slug: 'gradient-descent',
    synonym: 'Hạ gradient',
    definition: 'Thuật toán tối ưu hóa cốt lõi tính gradients của loss để điều chỉnh parameters xuống dốc.',
    description: '<p>Gradient descent là nền tảng của deep learning optimization. Tính đạo hàm của loss function theo parameters và update theo hướng giảm loss.</p>',
    examples: ['SGD, Adam là các variants phổ biến.', 'Learning rate quyết định step size mỗi iteration.'],
    relatedTerms: ['Algorithm', 'Training', 'Loss Function'],
    isActive: true,
    isFeatured: false,
  },

  // === H ===
  {
    term: 'Hallucination',
    slug: 'hallucination',
    synonym: 'Ảo giác',
    definition: 'Các mô hình tự tin tạo ra nội dung có vẻ hợp lý nhưng thực tế sai.',
    description: '<p>Hallucination là vấn đề nghiêm trọng của LLMs. Model có thể bịa ra facts, quotes, citations không tồn tại với độ tin cậy cao.</p>',
    examples: ['LLM có thể bịa ra paper citations không tồn tại.', 'RAG và grounding giúp giảm hallucination.'],
    relatedTerms: ['LLM', 'RAG', 'AI Safety'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'Hugging Face',
    slug: 'hugging-face',
    definition: 'Hub open-source cho models, datasets và ML tools.',
    description: '<p>Hugging Face là "GitHub for ML". Host hàng chục nghìn models, datasets và cung cấp transformers library phổ biến nhất cho NLP.</p>',
    examples: ['Transformers library của HF được dùng rộng rãi.', 'HF Hub host các open models như LLaMA, Mistral.'],
    relatedTerms: ['Open-source', 'Transformers', 'Model'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'Hyperparameter',
    slug: 'hyperparameter',
    synonym: 'Siêu tham số',
    definition: 'Các thiết lập trước training định hình cách mô hình học.',
    description: '<p>Hyperparameters như learning rate, batch size, number of layers được set trước training và không được learned từ data như weights.</p>',
    examples: ['Learning rate là hyperparameter quan trọng nhất.', 'Hyperparameter tuning dùng grid search hoặc Bayesian optimization.'],
    relatedTerms: ['Training', 'Parameter', 'Model'],
    isActive: true,
    isFeatured: false,
  },

  // === I ===
  {
    term: 'Image Generation',
    slug: 'image-generation',
    synonym: 'Tạo ảnh',
    definition: 'Tạo hình ảnh mới từ prompts sử dụng diffusion hoặc transformers.',
    description: '<p>Text-to-image models như DALL-E, Midjourney, Stable Diffusion có thể tạo ảnh từ mô tả text. Cách mạng hóa nghệ thuật số và design.</p>',
    examples: ['DALL-E 3 được tích hợp vào ChatGPT.', 'Midjourney nổi tiếng với phong cách artistic.'],
    relatedTerms: ['Diffusion Model', 'Generative AI', 'DALL-E'],
    isActive: true,
    isFeatured: false,
  },
  {
    term: 'Inference',
    slug: 'inference',
    synonym: 'Suy luận',
    definition: 'Chạy trained models forward trên inputs mới mà không update parameters.',
    description: '<p>Inference là khi bạn sử dụng model đã train. Khác với training, inference không update weights mà chỉ compute predictions.</p>',
    examples: ['GPT-4 API charges theo tokens cho inference.', 'Inference optimization quan trọng cho production deployment.'],
    relatedTerms: ['Training', 'Model', 'Deployment'],
    isActive: true,
    isFeatured: false,
  },

  // === L ===
  {
    term: 'Latent Space',
    slug: 'latent-space',
    synonym: 'Không gian tiềm ẩn',
    definition: 'Không gian nhiều chiều nội tại nơi models biểu diễn concepts và relationships.',
    description: '<p>Latent space là nơi AI "hiểu" world. Các concepts tương tự gần nhau trong latent space. Manipulating latent space cho phép control generation.</p>',
    examples: ['Interpolation trong latent space tạo smooth transitions.', 'Autoencoders learn compressed latent representations.'],
    relatedTerms: ['Embedding', 'Neural Network', 'Representation'],
    isActive: true,
    isFeatured: false,
  },
  {
    term: 'LLaMA',
    slug: 'llama',
    definition: 'Mô hình ngôn ngữ open-weight của Meta với nhiều kích thước khác nhau.',
    description: '<p>LLaMA (Large Language Model Meta AI) là flagship open model của Meta. LLaMA 3 có các versions 8B, 70B, 405B parameters.</p>',
    examples: ['LLaMA 3 70B competitive với closed models.', 'Nhiều fine-tuned variants như Vicuna dựa trên LLaMA.'],
    relatedTerms: ['Meta', 'Open-source', 'LLM'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'LLM',
    slug: 'llm',
    synonym: 'Large Language Model',
    definition: 'Networks hàng tỷ parameters dự đoán next tokens từ text corpora.',
    description: '<p>LLM là AI models với billions parameters train trên massive text data. GPT-4, Claude, Gemini là các LLM hàng đầu hiện nay.</p>',
    examples: ['GPT-4 có khoảng 1.7 trillion parameters.', 'LLMs excel at text generation, reasoning, coding.'],
    relatedTerms: ['GPT', 'Claude', 'Transformer'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'Loss Function',
    slug: 'loss-function',
    synonym: 'Hàm mất mát',
    definition: 'Công thức toán học đo độ sai của predictions; training tối thiểu hóa loss này.',
    description: '<p>Loss function đo khoảng cách giữa prediction và ground truth. Cross-entropy loss cho classification, MSE cho regression là các examples phổ biến.</p>',
    examples: ['Cross-entropy loss phổ biến cho classification.', 'Lower loss = better model performance.'],
    relatedTerms: ['Training', 'Gradient Descent', 'Optimization'],
    isActive: true,
    isFeatured: false,
  },

  // === M ===
  {
    term: 'Machine Learning',
    slug: 'machine-learning',
    synonym: 'Học máy',
    definition: 'Máy tính cải thiện tại các tasks bằng cách học patterns từ dữ liệu.',
    description: '<p>Machine Learning là subset của AI nơi algorithms learn từ data thay vì được programmed explicitly. Bao gồm supervised, unsupervised và reinforcement learning.</p>',
    examples: ['Spam filters dùng ML để classify emails.', 'Recommendation systems của Netflix dựa trên ML.'],
    relatedTerms: ['AI', 'Deep Learning', 'Algorithm'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'MCP',
    slug: 'mcp',
    synonym: 'Model Context Protocol',
    definition: 'Specification chuẩn hóa cách models gọi external tools.',
    description: '<p>MCP do Anthropic phát triển, cho phép LLMs interact với external services một cách standardized. Giống như USB cho AI tools.</p>',
    examples: ['Claude Desktop hỗ trợ MCP servers.', 'MCP cho phép AI access databases, APIs, files.'],
    relatedTerms: ['Tool Use', 'API', 'AI Agent'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'Mistral',
    slug: 'mistral',
    definition: 'Công ty Pháp phát hành các open models lean, high-performance.',
    description: '<p>Mistral AI nổi tiếng với các small but capable models. Mistral 7B outperform nhiều larger models. Mixtral là mixture-of-experts model của họ.</p>',
    examples: ['Mistral 7B rất efficient cho size của nó.', 'Mixtral 8x7B là MoE model competitive với GPT-3.5.'],
    relatedTerms: ['Open-source', 'LLM', 'Mixture of Experts'],
    isActive: true,
    isFeatured: false,
  },
  {
    term: 'Model',
    slug: 'model',
    synonym: 'Mô hình',
    definition: 'Learned function mapping inputs thành outputs; parameters encode kiến thức đã học.',
    description: '<p>Model trong ML là mathematical function với learned parameters. Sau training, model có thể make predictions trên new data.</p>',
    examples: ['GPT-4 là model với ~1.7T parameters.', 'Trained models được deploy cho inference.'],
    relatedTerms: ['Parameter', 'Training', 'Inference'],
    isActive: true,
    isFeatured: false,
  },
  {
    term: 'Multimodal AI',
    slug: 'multimodal-ai',
    synonym: 'AI đa phương thức',
    definition: 'Các mô hình hiểu và tạo ra nội dung qua text, images, audio và video.',
    description: '<p>Multimodal models như GPT-4V, Gemini có thể process nhiều loại input: text, images, audio. Đây là hướng phát triển quan trọng của AI.</p>',
    examples: ['GPT-4V có thể analyze images và trả lời questions.', 'Gemini được thiết kế multimodal từ đầu.'],
    relatedTerms: ['Vision Model', 'Gemini', 'GPT-4'],
    isActive: true,
    isFeatured: true,
  },

  // === N ===
  {
    term: 'NLP',
    slug: 'nlp',
    synonym: 'Natural Language Processing',
    definition: 'Lĩnh vực cho phép máy tính hiểu và tạo ra ngôn ngữ.',
    description: '<p>NLP bao gồm text classification, named entity recognition, machine translation, question answering và nhiều tasks khác. LLMs đã revolutionize NLP.</p>',
    examples: ['Google Translate dùng NLP để dịch ngôn ngữ.', 'Sentiment analysis là NLP task phổ biến.'],
    relatedTerms: ['LLM', 'Transformer', 'Text Generation'],
    isActive: true,
    isFeatured: false,
  },
  {
    term: 'Neural Network',
    slug: 'neural-network',
    synonym: 'Mạng neural',
    definition: 'Các "neurons" kết nối nhau có weights học từ dữ liệu.',
    description: '<p>Neural networks lấy cảm hứng từ não bộ. Gồm input layer, hidden layers và output layer. Deep learning = neural networks với nhiều layers.</p>',
    examples: ['CNN cho image processing, RNN cho sequences.', 'Transformers là kiến trúc neural network mới nhất.'],
    relatedTerms: ['Deep Learning', 'Layer', 'Weight'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'NVIDIA',
    slug: 'nvidia',
    definition: 'Nhà cung cấp GPU và software thống trị deep learning hiện đại.',
    description: '<p>NVIDIA gần như monopoly thị trường AI hardware. H100/H200 GPUs và CUDA software platform là nền tảng của hầu hết AI training.</p>',
    examples: ['NVIDIA H100 có giá ~$30,000 mỗi GPU.', 'CUDA là required cho hầu hết deep learning frameworks.'],
    relatedTerms: ['GPU', 'Training', 'Hardware'],
    isActive: true,
    isFeatured: false,
  },

  // === O ===
  {
    term: 'Open-source',
    slug: 'open-source',
    synonym: 'Mã nguồn mở',
    definition: 'Software được release với licenses cho phép inspection và redistribution.',
    description: '<p>Open-source AI movement quan trọng cho democratization. LLaMA, Mistral, Stable Diffusion là các open models có impact lớn.</p>',
    examples: ['LLaMA 3 là open-weight model từ Meta.', 'Hugging Face host thousands of open models.'],
    relatedTerms: ['Hugging Face', 'LLaMA', 'Mistral'],
    isActive: true,
    isFeatured: false,
  },
  {
    term: 'OpenAI',
    slug: 'openai',
    definition: 'Lab đằng sau GPT, ChatGPT và các mô hình DALL·E.',
    description: '<p>OpenAI là AI lab influential nhất hiện nay. Tạo ra ChatGPT phenomenon, GPT-4 và đang research AGI. Được back bởi Microsoft.</p>',
    examples: ['OpenAI nhận $10B investment từ Microsoft.', 'ChatGPT đạt 100M users trong 2 tháng.'],
    relatedTerms: ['GPT', 'ChatGPT', 'DALL-E'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'Overfitting',
    slug: 'overfitting',
    synonym: 'Quá khớp',
    definition: 'Các mô hình học những đặc thù của training data, thất bại trên data mới.',
    description: '<p>Overfitting xảy ra khi model "memorize" training data thay vì learn general patterns. Giống như học thuộc lòng thay vì hiểu bài.</p>',
    examples: ['Regularization như dropout giúp prevent overfitting.', 'Validation set dùng để detect overfitting early.'],
    relatedTerms: ['Underfitting', 'Training', 'Regularization'],
    isActive: true,
    isFeatured: false,
  },

  // === P ===
  {
    term: 'Parameter',
    slug: 'parameter',
    synonym: 'Tham số',
    definition: 'Learned weight xác định cách inputs transform qua các layers.',
    description: '<p>Parameters là weights và biases trong neural network. Được learned trong quá trình training. Model size thường đo bằng số parameters.</p>',
    examples: ['GPT-4 có khoảng 1.7 trillion parameters.', 'Larger models thường perform better nhưng expensive hơn.'],
    relatedTerms: ['Weight', 'Model', 'Training'],
    isActive: true,
    isFeatured: false,
  },
  {
    term: 'Prompt',
    slug: 'prompt',
    synonym: 'Lời nhắc',
    definition: 'Instructions và context điều hướng hành vi của LLM.',
    description: '<p>Prompt là input text bạn gửi cho LLM. Prompt quality ảnh hưởng lớn đến output quality. Prompt engineering là skill quan trọng.</p>',
    examples: ['System prompt define personality của AI assistant.', 'Few-shot prompts include examples để guide model.'],
    relatedTerms: ['Prompt Engineering', 'LLM', 'Context Window'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'Prompt Engineering',
    slug: 'prompt-engineering',
    synonym: 'Kỹ thuật prompt',
    definition: 'Thiết kế và test prompts một cách có hệ thống để có kết quả nhất quán.',
    description: '<p>Prompt engineering là "programming" cho LLMs. Techniques như few-shot learning, chain-of-thought, role-playing giúp improve output quality.</p>',
    examples: ['Adding "Let\'s think step by step" improves reasoning.', 'System prompts set behavior guidelines cho model.'],
    relatedTerms: ['Prompt', 'LLM', 'Chain-of-Thought'],
    isActive: true,
    isFeatured: true,
  },

  // === Q ===
  {
    term: 'Quantization',
    slug: 'quantization',
    synonym: 'Lượng tử hóa',
    definition: 'Nén models bằng cách lưu trữ weights với ít bits hơn để tăng tốc và tiết kiệm bộ nhớ.',
    description: '<p>Quantization reduce model size và inference cost bằng cách dùng lower precision (int8, int4 thay vì float32). Trade-off nhỏ về accuracy.</p>',
    examples: ['GGUF format cho quantized models phổ biến.', '4-bit quantization có thể reduce size 8x.'],
    relatedTerms: ['Model', 'Inference', 'Optimization'],
    isActive: true,
    isFeatured: false,
  },

  // === R ===
  {
    term: 'RAG',
    slug: 'rag',
    synonym: 'Retrieval-Augmented Generation',
    definition: 'Fetch tài liệu liên quan và inject vào prompts.',
    description: '<p>RAG kết hợp retrieval với generation. Trước khi generate, search relevant documents và add vào context. Giảm hallucination, enable knowledge updates.</p>',
    examples: ['Perplexity dùng RAG để cite sources.', 'Enterprise chatbots dùng RAG với internal docs.'],
    relatedTerms: ['Embedding', 'Vector Database', 'LLM'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'Reinforcement Learning',
    slug: 'reinforcement-learning',
    synonym: 'Học tăng cường',
    definition: 'Training agents để tối đa hóa reward thông qua trial and error.',
    description: '<p>RL là paradigm nơi agent learn từ interactions với environment. Maximize cumulative reward. Dùng cho games, robotics, và fine-tuning LLMs.</p>',
    examples: ['AlphaGo dùng RL để master game Go.', 'RLHF fine-tune LLMs with human preferences.'],
    relatedTerms: ['RLHF', 'Agent', 'Training'],
    isActive: true,
    isFeatured: false,
  },
  {
    term: 'RLHF',
    slug: 'rlhf',
    synonym: 'Reinforcement Learning from Human Feedback',
    definition: 'Humans xếp hạng outputs; reward models fine-tune accordingly.',
    description: '<p>RLHF là technique quan trọng để align LLMs với human preferences. Humans rank model outputs, train reward model, then RL fine-tune.</p>',
    examples: ['ChatGPT được train với RLHF.', 'InstructGPT paper introduce RLHF cho LLMs.'],
    relatedTerms: ['Alignment', 'Fine-tuning', 'Reinforcement Learning'],
    isActive: true,
    isFeatured: true,
  },

  // === S ===
  {
    term: 'Semantic Search',
    slug: 'semantic-search',
    synonym: 'Tìm kiếm ngữ nghĩa',
    definition: 'Tìm kiếm theo nghĩa thay vì exact keywords sử dụng vector similarity.',
    description: '<p>Semantic search hiểu intent và meaning. "cheap flights" match "budget airlines" dù không share keywords. Dựa trên embeddings.</p>',
    examples: ['Google search đã incorporate semantic understanding.', 'E-commerce sites dùng semantic search cho products.'],
    relatedTerms: ['Embedding', 'Vector Database', 'RAG'],
    isActive: true,
    isFeatured: false,
  },
  {
    term: 'Supervised Learning',
    slug: 'supervised-learning',
    synonym: 'Học có giám sát',
    definition: 'Training trên labeled examples nơi correct answers đã biết.',
    description: '<p>Supervised learning là paradigm phổ biến nhất. Model learn mapping từ inputs đến known outputs. Classification và regression là examples.</p>',
    examples: ['Image classification với labeled images là supervised.', 'Sentiment analysis với labeled reviews là supervised.'],
    relatedTerms: ['Unsupervised Learning', 'Classification', 'Training'],
    isActive: true,
    isFeatured: false,
  },

  // === T ===
  {
    term: 'Token',
    slug: 'token',
    synonym: 'Token',
    definition: 'Đơn vị xử lý nhỏ nhất, thường là các chunks subword; dùng cho billing.',
    description: '<p>Tokens là cách LLMs "đọc" text. Một word có thể là 1-3 tokens. API providers charge theo tokens used. ~4 chars = 1 token cho English.</p>',
    examples: ['GPT-4 charges $30/1M input tokens cho GPT-4.', '"Hello world" là khoảng 2 tokens.'],
    relatedTerms: ['Context Window', 'LLM', 'Tokenizer'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'Tool Use',
    slug: 'tool-use',
    synonym: 'Function Calling',
    definition: 'Hệ thống AI gọi external APIs và databases để lấy facts hoặc thực hiện actions.',
    description: '<p>Tool use cho phép LLMs interact với external world: search web, query databases, execute code, call APIs. Key capability cho AI agents.</p>',
    examples: ['ChatGPT có thể search web, run Python code.', 'Claude có Computer Use để control desktop.'],
    relatedTerms: ['AI Agent', 'API', 'MCP'],
    isActive: true,
    isFeatured: true,
  },
  {
    term: 'Transformer',
    slug: 'transformer',
    definition: 'Kiến trúc "Attention Is All You Need" sử dụng self-attention không có recurrence.',
    description: '<p>Transformer architecture revolutionize NLP năm 2017. Dựa hoàn toàn vào attention mechanism, enable parallelization và scale to billions params.</p>',
    examples: ['GPT, BERT, T5 đều dùng Transformer architecture.', 'Vision Transformers apply Transformers cho images.'],
    relatedTerms: ['Attention Mechanism', 'LLM', 'Deep Learning'],
    isActive: true,
    isFeatured: true,
  },

  // === U ===
  {
    term: 'Underfitting',
    slug: 'underfitting',
    synonym: 'Dưới khớp',
    definition: 'Các mô hình quá đơn giản không capture được patterns.',
    description: '<p>Underfitting xảy ra khi model quá simple cho data complexity. High bias, low variance. Cần increase model capacity hoặc train longer.</p>',
    examples: ['Linear model cho non-linear data sẽ underfit.', 'Underfitting có high training error.'],
    relatedTerms: ['Overfitting', 'Model', 'Training'],
    isActive: true,
    isFeatured: false,
  },
  {
    term: 'Unsupervised Learning',
    slug: 'unsupervised-learning',
    synonym: 'Học không giám sát',
    definition: 'Xác định patterns trong unlabeled data thông qua clustering và reduction.',
    description: '<p>Unsupervised learning tìm structure trong data không có labels. Clustering, dimensionality reduction, anomaly detection là examples.</p>',
    examples: ['K-means clustering là unsupervised algorithm.', 'Customer segmentation thường dùng unsupervised learning.'],
    relatedTerms: ['Supervised Learning', 'Clustering', 'Machine Learning'],
    isActive: true,
    isFeatured: false,
  },

  // === V ===
  {
    term: 'Vector',
    slug: 'vector',
    synonym: 'Vector',
    definition: 'Danh sách số có thứ tự encoding data cho algebraic manipulation và retrieval.',
    description: '<p>Vectors trong ML represent data points trong high-dimensional space. Operations như cosine similarity measure closeness between vectors.</p>',
    examples: ['Word embeddings là vectors 300-3000 dimensions.', 'Dot product measure similarity between vectors.'],
    relatedTerms: ['Embedding', 'Vector Database', 'Tensor'],
    isActive: true,
    isFeatured: false,
  },
  {
    term: 'Vector Database',
    slug: 'vector-database',
    synonym: 'Cơ sở dữ liệu vector',
    definition: 'Lưu trữ cho embedding vectors với fast nearest-neighbor retrieval.',
    description: '<p>Vector DBs optimized cho similarity search trên millions/billions vectors. Essential cho RAG, semantic search, recommendation systems.</p>',
    examples: ['Pinecone, Weaviate, Qdrant là popular vector DBs.', 'pgvector add vector support cho PostgreSQL.'],
    relatedTerms: ['Embedding', 'RAG', 'Semantic Search'],
    isActive: true,
    isFeatured: true,
  },

  // === W ===
  {
    term: 'Weight',
    slug: 'weight',
    synonym: 'Trọng số',
    definition: 'Learned parameters điều khiển signal flow giữa neurons.',
    description: '<p>Weights là parameters trong neural network connections. Được initialized randomly và learned trong training qua gradient descent.</p>',
    examples: ['Model với 7B params có 7 billion weights.', 'Weight initialization quan trọng cho training stability.'],
    relatedTerms: ['Parameter', 'Neural Network', 'Training'],
    isActive: true,
    isFeatured: false,
  },

  // === Z ===
  {
    term: 'Zero-shot Learning',
    slug: 'zero-shot-learning',
    synonym: 'Học không mẫu',
    definition: 'Các mô hình giải quyết tasks chưa từng thấy trong training qua general representations.',
    description: '<p>Zero-shot = model perform task mà không cần examples. LLMs có remarkable zero-shot abilities nhờ pre-training on diverse data.</p>',
    examples: ['GPT-4 có thể translate languages không có trong training.', 'CLIP có zero-shot image classification.'],
    relatedTerms: ['Few-shot Learning', 'Transfer Learning', 'LLM'],
    isActive: true,
    isFeatured: false,
  },
];

// ============================================
// SEED FUNCTION
// ============================================
async function seedAIDictionary() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/managepost';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    let createdCount = 0;
    let skippedCount = 0;

    console.log('\n--- Seeding AI Dictionary Terms ---\n');

    for (const termData of aiDictionaryData) {
      // Check if term exists
      const existingTerm = await DictionaryTerm.findOne({ slug: termData.slug });

      if (existingTerm) {
        console.log(`→ Exists: ${termData.term}`);
        skippedCount++;
        continue;
      }

      // Create term
      await DictionaryTerm.create(termData);
      console.log(`✓ Created: ${termData.term}`);
      createdCount++;
    }

    console.log('\n✅ Seed AI dictionary completed!');
    console.log(`\nSummary:`);
    console.log(`- Created: ${createdCount} terms`);
    console.log(`- Skipped: ${skippedCount} terms (already exist)`);

    const totalTerms = await DictionaryTerm.countDocuments();
    console.log(`- Total terms in DB: ${totalTerms}`);
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run if called directly
seedAIDictionary();

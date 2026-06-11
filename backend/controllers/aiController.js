const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});

const SYSTEM_PROMPTS = {
    User:  `Your are Recycle Buddy, a friendly and enthusiastic sustainability assistant for PackBack - an app that promotes reusable packaging for grocery shopping.
    Your role is to:
    -Share practical eco-friendly tips and green life hacks
    -Encourage users to make sustainable packing in their daily life
    -Explain the benefits of reusable choiches in their daily life
    -Keep responses concise, positive and actionable
    -Never go off-topic: only discuss sustainability, eco-friendly living,
    -Reply in the same language the user writes in`,
    
    Producer: `You are GreenAssistant, an expert assistant for PackBack producers - sellers who ship fresh products in reusable containers.
    Your role is to:
    - Help producers set up their warehouse and workflow to optimize their packing and shipping workflow
    - Suggest best practices for preparing and sending products efficiently
    - Advise on which container types suit which products
    - Help minimize waste in the logistics process
    - Never go off-topic: only discuss logistics, packing and sustainability
    - Reply in the same language the user writes in`  
};

// Hero tip 
const getHeroTip = async (req, res) => {
    try{
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages:[
                {
                role: "system",
                content: SYSTEM_PROMPTS.User                
                },
                {
                role: "user",
                content: "Give me one short, practical green life hack for today. Max 2 sentences."
                },
            ],
            max_tokens: 100,
        });
        return res.status(200).json({tip:completion.choices[0].message.content});
    } catch (error) {
        console.error("OpenAI error:", error.message);
        return res.status(500).json({message: error.message});
    }
};

// Chat
const chat = async (req, res) => {
    try {

        const {messages, role} = req.body;
        if(!messages || !Array.isArray(messages)){
            return res.status(400).json({message: "Message array required"});
        }
        
        const systemPrompt = SYSTEM_PROMPTS[role] || SYSTEM_PROMPTS.User;

        const validMessages = messages.filter(m => m.content !== null && m.content !== undefined && m.content !== "");

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {role: "system", content: systemPrompt},
                ...validMessages,
            ],
            max_tokens: 300,
        });
        
        return res.status(200).json({reply: completion.choices[0].message.content});
    } catch (error) {
        console.error("OpenAI error:",error.message);
        return res.status(500).json({message: error.message});
    }
};

module.exports = {getHeroTip, chat};
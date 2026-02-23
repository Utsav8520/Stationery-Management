import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement newsletter subscription API call
        setSubscribed(true);
        setEmail("");
        setTimeout(() => setSubscribed(false), 3000);
    };

    return (
        <section className="py-16 bg-gradient-primary">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                        <Mail className="w-8 h-8 text-white" />
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                        Stay Updated
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Subscribe to our newsletter for exclusive offers and new arrivals
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                        />
                        <Button
                            type="submit"
                            className="bg-white text-purple-600 hover:bg-white/90 shadow-lg"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Subscribe
                        </Button>
                    </form>

                    {subscribed && (
                        <p className="mt-4 text-white font-medium animate-fade-in">
                            ✓ Thank you for subscribing!
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Newsletter;

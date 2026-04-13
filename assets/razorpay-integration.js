// Razorpay integration for Futurewave.in
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the custom pricing to be injected in DOM
    const interval = setInterval(() => {
        const btnBasic = document.getElementById('btn-plan-basic');
        const btnPro = document.getElementById('btn-plan-pro');

        if (btnBasic && btnPro) {
            clearInterval(interval);

            // HMAC generator function
            const generateSignature = async (secret, payloadStr) => {
                const enc = new TextEncoder();
                const key = await crypto.subtle.importKey(
                    "raw", enc.encode(secret), {name: "HMAC", hash: "SHA-256"}, false, ["sign"]
                );
                const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(payloadStr));
                return Array.from(new Uint8Array(signatureBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
            };

            // Razorpay options config
            const createRazorpayOptions = (planName, amount) => {
                return {
                    "key": "rzp_live_SassCau6r4lvu5", // Live Razorpay Key
                    "amount": amount * 100, // Amount is in currency subunits. 99 INR = 9900 paise.
                    "currency": "INR",
                    "name": "Check-iN Health",
                    "description": `${planName} Subscription`,
                    "image": "https://senior-health-guardian.deploypad.app/placeholder.svg",
                    "handler": async function (response) {
                        try {
                            const WEBHOOK_SECRET = "BV2vVymyG27wTFk1r23f5Y3r"; // REPLACE THIS!
                            const payloadObj = {
                                amount_paise: amount * 100,
                                billing_cycle: "monthly",
                                plan_type: planName.toLowerCase(),
                                razorpay_order_id: response.razorpay_order_id || "",
                                razorpay_payment_id: response.razorpay_payment_id || "",
                                user_id: "unknown_from_homepage"
                            };
                            
                            const signPayload = JSON.stringify(payloadObj);
                            const signature = await generateSignature(WEBHOOK_SECRET, signPayload);
                            payloadObj.signature = signature;

                            await fetch("https://magnrdegcegxdtgapyez.supabase.co/functions/v1/confirm-payment", {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payloadObj)
                            });
                        } catch (e) {
                            console.error("Webhook POST failed", e);
                        }

                        // On success, redirect to Lovable App success callback
                        const redirectUrl = `https://iamgood.lovable.app/subscription?status=success&payment_id=${response.razorpay_payment_id}&plan=${planName.toLowerCase()}`;
                        window.location.href = redirectUrl;
                    },
                    "prefill": {
                        "name": "",
                        "email": "",
                        "contact": ""
                    },
                    "theme": {
                        "color": "#1e293b"
                    },
                    "modal": {
                        "ondismiss": function() {
                            // Redirect to cancelled if closed
                            window.location.href = "https://iamgood.lovable.app/subscription?status=cancelled";
                        }
                    }
                };
            };

            btnBasic.addEventListener('click', (e) => {
                e.preventDefault();
                const rzpBasic = new Razorpay(createRazorpayOptions('Basic', 99));
                rzpBasic.open();
            });

            btnPro.addEventListener('click', (e) => {
                e.preventDefault();
                const rzpPro = new Razorpay(createRazorpayOptions('Pro', 199));
                rzpPro.open();
            });
        }
    }, 500);
});

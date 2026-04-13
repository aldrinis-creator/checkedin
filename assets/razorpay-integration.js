// Razorpay integration for Futurewave.in
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the custom pricing to be injected in DOM
    const interval = setInterval(() => {
        const btnBasic = document.getElementById('btn-plan-basic');
        const btnPro = document.getElementById('btn-plan-pro');

        if (btnBasic && btnPro) {
            clearInterval(interval);

            // Razorpay options config
            const createRazorpayOptions = (planName, amount) => {
                return {
                    "key": "rzp_live_SassCau6r4lvu5", // User should replace this with actual Test/Live key
                    "amount": amount * 100, // Amount is in currency subunits. 99 INR = 9900 paise.
                    "currency": "INR",
                    "name": "Check-iN Health",
                    "description": `${planName} Subscription`,
                    "image": "https://senior-health-guardian.deploypad.app/placeholder.svg",
                    "handler": function (response) {
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

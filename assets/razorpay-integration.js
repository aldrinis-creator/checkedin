// Razorpay integration for Futurewave.in
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the custom pricing to be injected in DOM
    const interval = setInterval(() => {
        const btnBasic = document.getElementById('btn-plan-basic');
        const btnPro = document.getElementById('btn-plan-pro');
        const btnPremiumPlus = document.getElementById('btn-plan-premium-plus');

        if (btnBasic && btnPro && btnPremiumPlus) {
            clearInterval(interval);

            // --- Toggle Monthly/Yearly Logic ---
            const btnMonthly = document.getElementById('btn-toggle-monthly');
            const btnYearly = document.getElementById('btn-toggle-yearly');

            const togglePricing = (cycle) => {
                const isYearly = cycle === 'yearly';
                
                // Update Button Styles
                if(isYearly) {
                    btnYearly.style.backgroundColor = '#0070c9';
                    btnYearly.style.color = 'white';
                    btnMonthly.style.backgroundColor = 'transparent';
                    btnMonthly.style.color = '#64748b';
                } else {
                    btnMonthly.style.backgroundColor = '#0070c9';
                    btnMonthly.style.color = 'white';
                    btnYearly.style.backgroundColor = 'transparent';
                    btnYearly.style.color = '#64748b';
                }

                // Update Displayed Values
                document.getElementById('val-basic').textContent = isYearly ? '999' : '99';
                document.getElementById('val-premium').textContent = isYearly ? '1999' : '199';
                document.getElementById('val-premium-plus').textContent = isYearly ? '9999' : '999';

                document.querySelectorAll('.cycle-label').forEach(el => {
                    el.textContent = isYearly ? '/yr' : '/mo';
                });

                // Update Data Attributes for Razorpay
                btnBasic.dataset.amount = isYearly ? '999' : '99';
                btnPro.dataset.amount = isYearly ? '1999' : '199';
                btnPremiumPlus.dataset.amount = isYearly ? '9999' : '999';

                btnBasic.dataset.cycle = cycle;
                btnPro.dataset.cycle = cycle;
                btnPremiumPlus.dataset.cycle = cycle;
            };

            if(btnMonthly && btnYearly) {
                btnMonthly.addEventListener('click', () => togglePricing('monthly'));
                btnYearly.addEventListener('click', () => togglePricing('yearly'));
            }

            // --- Razorpay Execution ---

            // HMAC generator function
            const generateSignature = async (secret, payloadStr) => {
                const enc = new TextEncoder();
                const key = await crypto.subtle.importKey(
                    "raw", enc.encode(secret), {name: "HMAC", hash: "SHA-256"}, false, ["sign"]
                );
                const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(payloadStr));
                return Array.from(new Uint8Array(signatureBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
            };

            const renderReceipt = (paymentId, planName, amount, cycle) => {
                const pricingGridContainer = document.getElementById('pricing-grid');
                if(!pricingGridContainer) return;
                
                const receiptDate = new Date().toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                });

                const shareText = `Futurewave Check-iN Receipt\nPayment ID: ${paymentId}\nPlan: ${planName} (${cycle})\nAmount Paid: ₹${amount}\nDate: ${receiptDate}`;
                const mailtoLink = `mailto:?subject=Futurewave Subscription Receipt&body=${encodeURIComponent(shareText)}`;
                const whatsappLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

                const receiptHTML = `
                <div class="col-span-1 lg:col-span-3 max-w-2xl mx-auto w-full">
                    <div class="bg-white rounded-2xl border-2 border-emerald-500 p-8 shadow-xl relative w-full text-center">
                        <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h2 class="text-3xl font-bold text-[#1e293b] mb-2" style="font-family: Outfit, sans-serif;">Payment Successful!</h2>
                        <p class="text-slate-500 mb-6">Your subscription is now active.</p>
                        
                        <div class="bg-slate-50 rounded-xl p-6 text-left mb-6 border border-slate-100 shadow-inner">
                            <div class="flex justify-between border-b border-slate-200 pb-3 mb-3">
                                <span class="text-slate-500 font-medium tracking-wide text-sm">TRANSACTION ID</span>
                                <span class="font-bold text-[#1e293b]">${paymentId}</span>
                            </div>
                            <div class="flex justify-between border-b border-slate-200 pb-3 mb-3">
                                <span class="text-slate-500 font-medium tracking-wide text-sm">PLAN SELECTED</span>
                                <span class="font-bold text-[#1e293b]">${planName} <span class="text-xs uppercase bg-[#1e293b] text-white px-2 py-0.5 rounded-md ml-1">${cycle}</span></span>
                            </div>
                            <div class="flex justify-between border-b border-slate-200 pb-3 mb-3">
                                <span class="text-slate-500 font-medium tracking-wide text-sm">DATE</span>
                                <span class="font-bold text-[#1e293b]">${receiptDate}</span>
                            </div>
                            <div class="flex justify-between pt-2">
                                <span class="text-slate-600 font-bold uppercase tracking-widest">TOTAL PAID</span>
                                <span class="text-2xl font-bold text-emerald-600">₹${amount}</span>
                            </div>
                        </div>

                        <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                            <a href="${whatsappLink}" target="_blank" class="bg-[#25D366] text-white py-3 px-6 rounded-xl font-medium shadow-md hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> 
                                Share via WhatsApp
                            </a>
                            <a href="${mailtoLink}" class="bg-indigo-600 text-white py-3 px-6 rounded-xl font-medium shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                Send via Email
                            </a>
                        </div>
                        <div class="mt-8">
                           <a href="https://iamgood.lovable.app" class="text-[#0070c9] font-bold hover:underline">Proceed to Application &rarr;</a>
                        </div>
                    </div>
                </div>`;
                
                // Hide pricing top header text
                const headerText = pricingGridContainer.previousElementSibling;
                if(headerText) headerText.style.display = 'none';

                // Swap out the grid for the receipt
                pricingGridContainer.innerHTML = receiptHTML;
                pricingGridContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            };

            // Razorpay options config
            const createRazorpayOptions = (planName, amount, cycle) => {
                return {
                    "key": "rzp_live_SassCau6r4lvu5", // Live Razorpay Key
                    "amount": parseInt(amount) * 100, // Amount is in currency subunits.
                    "currency": "INR",
                    "name": "Check-iN Health",
                    "description": `${planName} Subscription (${cycle})`,
                    "image": "https://senior-health-guardian.deploypad.app/placeholder.svg",
                    "handler": async function (response) {
                        try {
                            const WEBHOOK_SECRET = "BV2vVymyG27wTFk1r23f5Y3r"; // REPLACE THIS!
                            const payloadObj = {
                                amount_paise: parseInt(amount) * 100,
                                billing_cycle: cycle,
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

                        // Generate Receipt on Page instead of Redirecting!
                        renderReceipt(response.razorpay_payment_id, planName, amount, cycle);
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
                            console.log("Payment modal closed by user.");
                        }
                    }
                };
            };

            const handleCheckout = (e) => {
                e.preventDefault();
                const btn = e.currentTarget;
                const planName = btn.dataset.plan;
                const amount = btn.dataset.amount;
                const cycle = btn.dataset.cycle;
                
                const rzp = new Razorpay(createRazorpayOptions(planName, amount, cycle));
                rzp.open();
            };

            btnBasic.addEventListener('click', handleCheckout);
            btnPro.addEventListener('click', handleCheckout);
            btnPremiumPlus.addEventListener('click', handleCheckout);
        }
    }, 500);
});

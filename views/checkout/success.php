<main class="flex-1 success__checkout">
    <div class="success__checkout-content">
        <img src="/build/img/success.svg" alt="Success"  />
        <h1>Payment Successful!</h1>
        <p>Thank you for your purchase.</p>
        <p>Order Date: <?php echo date('Y-m-d'); ?> </p>
        <div class="content__buttons">

            <button>
                <a href="/">Go to Home</a>
            </button>
            <button>
                <a href="/food-market">Buy More</a>
            </button>

        </div>

        <section class="content__gratitude">

            <div class="gratitude__content">

                <div>
                    <h2>We really appreciate that you have trusted us</h2>
                    <p>Subscribe now to our newsletter and get a 20% discount code</p>
                </div>
            
                <div class="gratitude__content-newsletter mt-20">
                    <input type="text" placeholder="Your email here">
                    <button class="subscribe-button">
                        Subscribe
                    </button>
                </div>

            </div>
            <div>
                <img src="/build/img/newsletter.svg" alt="newsletter image">
            </div>

        </section>
    </div>
</main>

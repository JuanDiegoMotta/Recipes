<main class="container flex flex-col justify-center align-center flex-1">

    <section class="modal__cancel <?php echo $canceled ? '' : 'none' ?> ">
        <div class="success_checkout-content">
        <div class="success__checkout-content">
        <img src="/build/img/cancel.svg" alt="cancel image"  />
        <h1>Payment canceled!</h1>
        <p>Oops, seems like you canceled the payment</p>
        <p>Try again!</p>
        <div class="content__buttons">

            <button class="btn__close__modal" style="color: #fff;">
                Close
            </button>
            <button class="none"></button>

        </div>
    </div>
        </div>
    </section>

    <section class="checkout flex-1">
        <div class="checkout__left">
            
        </div>
        <div class="checkout__right">
            <ul class="checkout__right-container">
                <li>
                    <h3>Order Summary</h3>
                    <p class="checkout__price"></p>
                    <button type="submit" class="checkout__buy__button">Buy now</button>
                </li>
                <li>
                    <h3>Currently supporting:</h3>
                    <div class="card-imgs">
                        <img src="build/img/checkout/visa.png" alt="visa logo">
                        <img src="build/img/checkout/mastercard.svg" alt="mastercard logo">
                        <img src="build/img/checkout/paypal.png" alt="paypal logo">
                        <img src="build/img/checkout/googlepay.svg" alt="googlepay logo">
                    </div>
                </li>
            </ul>
        </div>
    </section>
</main>
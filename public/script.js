const stripe = Stripe(
  "pk_test_51Mbcm0KiLfUAS7VJyOVdThvOlmTOQ9ShopuYiLyx9gVFXqJO1rTTpoJ9HEV6ZD0CGbRgoCBvQsC1eSJ6lxmH0HO600AK60C5qR"
);
const elements = stripe.elements();

const cardElement = elements.create("card");
cardElement.mount("#card-element");

function getInitializePaymentBody(paymentMethodKoId) {
  const shouldSaveCard = document.getElementById("saveCard").checked;
  const defaultBody = {
    paymentMethodId: "",
    user: {
      id: "USER_ID_2",
      name: "Mili Kayestha",
      imageUrl: "lorem",
      email: "loremepsum@wmail.com",
      amount: 2500,
      currency: "usd",
    },
  };
  if (shouldSaveCard) {
    defaultBody.paymentMethodId = paymentMethodKoId;
  }
  return defaultBody;
}

function initializePayment(paymentMethodKoId) {
  const stringifeidBody = JSON.stringify(
    getInitializePaymentBody(paymentMethodKoId)
  );
  return fetch("http://localhost:8080/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: stringifeidBody,
  }).then((res) =>
    res
      .json()
      .then((result) => {
        confirmPayment(result.clientSecret);
      })
      .catch((_) => {})
      .catch((_) => {})
  );
}

async function confirmPayment(clientSecret) {
  console.log("inside cp",clientSecret);
  const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: cardElement,
    },
  });
  if (result.error) {
    console.error(result.error);
  } else {
    alert("Thank you for your business!");
  }
}

document.getElementById("pay-button").addEventListener("click", async () => {
  // const { clientSecret } = await initializePayment();
  try {
    const id = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: "Milu",
      },
    });

    const paymentMethodKoId = id.paymentMethod.id;

    initializePayment(paymentMethodKoId);
  } catch (e) {
    console.log("error airaxa", e);
  }
});

import { showAlert } from "./alert";

// export const bookTour = async (tourID) => {
//   try {
//     const response = await fetch(
//       `http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourID}`
//     );

//     //2 create chect form + credit card
//     if (!response.ok) {
//       throw new Error(`Failed to fetch checkout session: ${response.status}`);
//     }

//     const session = await response.json();

//     return session;
//   } catch (error) {
//     console.log(error);
//     showAlert("error", error);
//   }
// };

export const bookTour = async (tourID) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourID}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch checkout session: ${response.status}`);
    }

    const session = await response.json();

    showAlert("success", "Payment is processing..!");

    return session;
  } catch (error) {
    console.error("Error fetching or processing checkout session:", error);
    showAlert("error", error);
  }
};

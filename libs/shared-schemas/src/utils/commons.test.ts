// import { default as commons } from "./commons.json";
// import { getAjv } from "@zenigata/utils";

// const ajv = getAjv().addSchema(commons);
// const schema = commons.properties;

// describe("DateTime", () => {
//   it("Correct datetime format", () => {
//     const data = "2023-11-19T14:47:30Z";

//     expect(ajv.validate(schema.DateTime, data)).toBeTruthy();
//   });

//   it("Wrong datetime formats", () => {
//     const data = ["2023-11-19", "14:47:30", "19-Nov-2023 14:47:30 UTC"];

//     data.forEach((data) => {
//       expect(ajv.validate(schema.DateTime, data)).toBeFalsy();
//     });
//   });
// });

// describe("Email", () => {
//   it("Correct email format", () => {
//     const data = "john.doe@unknown.org";

//     expect(ajv.validate(schema.Email, data)).toBeTruthy();
//   });

//   it("Wrong email formats", () => {
//     const data = ["unknown.org", "wrong@email", "wrong,email@gmail.com"];

//     data.forEach((data) => {
//       expect(ajv.validate(schema.Email, data)).toBeFalsy();
//     });
//   });
// });

// describe("Meta", () => {
//   it("Correct structure and data", () => {
//     const data = {
//       label: "Correct label under 70 characters",
//       content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
//     };

//     expect(ajv.validate(schema.Meta, data)).toBeTruthy();
//   });

//   it("Wrong structure and data", () => {
//     const data = [
//       {
//         label: "Correct label under 70 characters",
//         content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//         wrongProperty: true
//       },
//       {
//         label: "It is expected that this label will not work because it exceeds the 70 character limit",
//         content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
//       },
//       {
//         label: "Label only"
//       }
// ];

//     data.forEach((data) => {
//       expect(ajv.validate(schema.Meta, data)).toBeFalsy();
//     });
//   });
// });

// describe("Uuid", () => {
//   it("Correct v4 uuid format", () => {
//     const data = "e362b174-4a3a-4e9c-8e33-560bdb93bd57";

//     expect(ajv.validate(schema.Uuid, data)).toBeTruthy();
//   });

//   it("Wrong v4 uuid format", () => {
//     const data = ["123456", "e362b174-4a3a-4e9c-8e33-560bdb93bd-7"];

//     data.forEach((data) => {
//       expect(ajv.validate(schema.Uuid, data)).toBeFalsy();
//     });
//   });
// });

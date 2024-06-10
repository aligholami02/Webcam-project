import { Form } from "antd";
import { useRef, useState } from "react";
import Webcam from "react-webcam";
import FormData from "form-data";
import "./style.css";

// type formType = {
//   telegram_id: string;
//   name: string;
// };

const videoConstraints = {
  width: 220,
  height: 200,
  facingMode: "user",
};

const Content = () => {
  // const [form, setForm] = useState<formType>({
  //   telegram_id: "",
  //   name: "",
  // });

  const telegramToken = "7443522978:AAFZZZlo0dYPlHOc4h2cPDw4igQBdhU8JX0";

  const telegramChatId = "-1002248016905";

  const webcamRef = useRef(null);

  const [imgSrc, setImgSrc] = useState("");

  // const telegramChatId = form?.telegram_id;
  // const [formData] = Form.useForm();

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  };

  const sendPhotoToTelegram = async () => {
    if (imgSrc) {
      try {
        const response = await fetch(imgSrc);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append("chat_id", telegramChatId);
        formData.append("photo", blob, "webcam-photo.jpg");

        const telegramResponse = await fetch(
          `https://api.telegram.org/bot${telegramToken}/sendPhoto`,
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await telegramResponse.json();
        if (result.ok) {
          alert("Photo sent successfully to the channel!");
        } else {
          console.error("Error sending photo:", result);
          alert("Failed to send photo");
        }
      } catch (error) {
        console.error("Error sending photo:", error);
        alert("Failed to send photo");
      }
    }
  };

  const handleSubmit = async () => {
    sendPhotoToTelegram();
  };

  return (
    <div className="home-container">
      <div className="container">
        <div className="text">
          <h1>Take your photo!</h1>
          <Form
            className="form"
            // form={formData}
            // autoComplete={"off"}
            // onFinish={handleSubmit}
          >
            <div className="webcam-container">
              <div className="webcam-img flex justify-center">
                {imgSrc === "" ? (
                  <Webcam
                    audio={false}
                    height={200}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={290}
                    videoConstraints={videoConstraints}
                  />
                ) : (
                  <img src={imgSrc} />
                )}
              </div>
              <div>
                {imgSrc != "" ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setImgSrc("");
                    }}
                    className="webcam-btn"
                  >
                    Retake Image
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      capture();
                    }}
                    className="webcam-btn"
                  >
                    Capture
                  </button>
                )}
              </div>
            </div>
            <div className="mb-5">
              <span className="text-lg">Telegram Channel:</span>
              <a
                href="https://t.me/+yqqh79gBdeUxZDFk"
                target="_blank"
                className="text-red-500 font-bold"
              >
                {" "}
                Click me!
              </a>
            </div>
            {/* <Form.Item
              style={{
                padding: 0,
                margin: 0,
              }}
              name={"telegram_id"}
              rules={[{ required: true, message: "Telegram Id is required" }]}
            >
              <input
                required
                placeholder="Telegram Id"
                onChange={(e) =>
                  setForm({ ...form, telegram_id: e.target.value })
                }
                value={form.telegram_id}
              />
            </Form.Item>
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              value={form.name}
            />
            <Form.Item> */}
            <button onClick={handleSubmit} type="submit" id="login-button">
              Submit
            </button>
            {/* </Form.Item> */}
          </Form>
        </div>
      </div>
    </div>
  );
};
export default Content;

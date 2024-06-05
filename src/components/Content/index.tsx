import { Form } from "antd";
import axios from "axios";
import { useRef, useState } from "react";
import Webcam from "react-webcam";
import "./style.css";

type formType = {
  telegram_id: string;
  name: string;
};

const videoConstraints = {
  width: 220,
  height: 200,
  facingMode: "user",
};

const Content = () => {
  const [form, setForm] = useState<formType>({
    telegram_id: "",
    name: "",
  });

  const [imgSrc, setImgSrc] = useState("");

  const webcamRef = useRef(null);

  const telegramToken = "7309548221:AAFkFBPsfVTN4My3EeJjrIeW3mURyVUTkC4";

  const telegramChatId = form?.telegram_id;

  const [formData] = Form.useForm();

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  };

  const sendPhotoToTelegram = async (imageData) => {
    try {
      const formData = new FormData();
      formData.append("photo", imageData);

      await axios.post(
        `https://api.telegram.org/bot${telegramToken}/sendPhoto?chat_id=${telegramChatId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Photo sent to Telegram successfully!");
    } catch (error) {
      alert("Error");
      console.error("Error sending photo to Telegram:", error);
    }
  };

  const handleSubmit = async () => {
    sendPhotoToTelegram(imgSrc);
  };

  return (
    <div className="home-container">
      <div className="container">
        <div className="text">
          <h1>Fill up this form!</h1>
          <Form
            form={formData}
            className="form"
            autoComplete={"off"}
            onFinish={handleSubmit}
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
            <Form.Item
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
            <Form.Item>
              <button type="submit" id="login-button">
                Submit
              </button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default Content;

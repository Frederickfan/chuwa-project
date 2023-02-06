import React, { useState } from "react";
import { FileImageOutlined } from '@ant-design/icons';
import { Image, Button, Input } from "antd";


export default function ImageUploader({imageURL, setImageURL}) {
  const [uploaded, setUploaded] = useState(false);

  const handleImageUpload = async (event, imageUrl) => {
    event.preventDefault();

    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const imagePreviewUrl = URL.createObjectURL(blob);

    setUploaded(true);
  };

  const imageLinkInputHandler = (e) => {
    e.preventDefault();
    setUploaded(false);
    setImageURL(e.target.value);
  }

  return (
    <div>
      <Input style={{width: 400}} size="medium" onChange={imageLinkInputHandler} placeholder="Image URL..." prefix={<FileImageOutlined />} />
      <Button 
        type="primary" 
        size={"medium"} 
        onClick={(e) => {
          handleImageUpload(e, imageURL)
        }}
      >
        Upload
      </Button>
      {
        <Image
          width={210}
          height={230}
          src={uploaded ? imageURL : "https://st4.depositphotos.com/14953852/22772/v/450/depositphotos_227725184-stock-illustration-image-available-icon-flat-vector.jpg"}
          fallback="https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
        />
      }
    </div>
  );
}

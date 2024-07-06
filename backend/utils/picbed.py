from imgurpython import ImgurClient
from datetime import datetime


class ImgurUploader:

    allowed_image_fields = {"album", "name", "title", "description"}

    def __init__(self, picbed_config):
        self.client_id = picbed_config["client_id"]
        self.client_secret = picbed_config["client_secret"]
        self.refresh_token = picbed_config["refresh_token"]
        self.album = picbed_config["album"]

        self.client = ImgurClient(
            client_id=self.client_id,
            client_secret=self.client_secret,
            access_token=None,
            refresh_token=self.refresh_token,
            mashape_key=None,
        )
        self.client.auth.refresh()

    # Upload image, image_data should be bytes
    def upload(self, image_data, name, title):

        # Remove prefix to get the actual base64 encoding
        _, image_data_base64 = image_data.split(",", 1)

        config = {
            "album": self.album,
            "name": name,
            "title": title,
            "description": f"test-{datetime.now()}",
        }

        data = {
            "image": image_data_base64,
            "type": "base64",
        }

        data.update(
            {
                meta: config[meta]
                for meta in self.allowed_image_fields.intersection(config.keys())
            }
        )

        try:
            image = self.client.make_request("POST", "upload", data, False)
            print("Image uploaded successfully! Link:", image["link"])
            return image["link"]
        except Exception as e:
            print("Image upload failed:", e)
            return None

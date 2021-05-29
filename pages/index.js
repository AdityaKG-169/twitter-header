import React, { useState } from "react";
import styles from "./Home.module.css";
import Image from "next/image";
import * as htmlToImage from "html-to-image";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";

export default function Home() {
	const [users, setUsers] = useState([]);

	function makeImage() {
		fetch(
			"https://cors-anywhere.herokuapp.com/" +
				"https://api.twitter.com/1.1/followers/list.json?count=3&screen_name=codencoff",
			{
				method: "get",
				headers: {
					"content-type": "application/json",
					authorization: `OAuth oauth_consumer_key="CONSUMER_KEY",oauth_token="OAUTH_TOKEN",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1622093015",oauth_nonce="OAUTH_NONCE",oauth_version="1.0",oauth_signature="OAUTH_SIGNATURE"`,
				},
			}
		)
			.then((res) => res.json())
			.then((data) => {
				let userArray = data.users.map((i) => "@" + i.screen_name);
				return setUsers(() => userArray);
			})

			.then(() => {
				htmlToImage
					.toJpeg(document.getElementById("Home_parent__g3DMp"), {
						quality: 1.0,
					})
					.then(function (dataUrl) {
						fetch(dataUrl)
							.then((res) => res.blob())
							.then((blob) => {
								const file = new File([blob], "File name", {
									type: "image/jpeg",
								});
								let formData = new FormData();
								formData.append("banner", file);

								fetch(
									"https://cors-anywhere.herokuapp.com/" +
										"https://api.twitter.com/1.1/account/update_profile_banner.json",
									{
										method: "post",
										headers: {
											authorization: `OAuth oauth_consumer_key="OAUTH_CONSUMER_KEY",oauth_token="OAUTH_TOKEN",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1622103110",oauth_nonce="OAUTH_NONCE",oauth_version="1.0",oauth_signature="OAUTH_SIGNATURE"`,
										},
										body: formData,
									}
								).then((data) => console.log(data));
							});
					});
			});
	}

	return (
		<>
			<div id={styles.parent}>
				<div className={styles.followers_container}>
					{/* <span className={styles.heading}>Last 3 Followers</span> */}
					<div className={styles.profile_containers}>
						<div className={styles.profile_container_yellow}>
							<div className={styles.profile_border_yellow}></div>
							<p className={styles.profile_name}>
								{users.length ? users[0] : ""}
							</p>
						</div>
						<div className={styles.profile_container_white}>
							<div className={styles.profile_border_white}></div>
							<p className={styles.profile_name}>
								{users.length ? users[1] : ""}
							</p>
						</div>
						<div className={styles.profile_container_yellow}>
							<div className={styles.profile_border_yellow}></div>
							<p className={styles.profile_name}>
								{users.length ? users[2] : ""}
							</p>
						</div>
					</div>
				</div>
			</div>
			<button onClick={makeImage} id={styles.button}>
				Generate Image
			</button>
		</>
	);
}

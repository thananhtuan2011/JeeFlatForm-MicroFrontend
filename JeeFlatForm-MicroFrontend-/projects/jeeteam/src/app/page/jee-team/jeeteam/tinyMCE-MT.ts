import { environment } from "projects/jeeteam/src/environments/environment";

const tinyMCE_MT = {

	plugins: ' autoresize paste print code preview  searchreplace autolink directionality  visualblocks visualchars fullscreen image link media  template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern help ',
	toolbar: 'insertfile undo redo | styleselect |  fontselect| bold italic underline | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | forecolor backcolor image link table  | removeformat code preview ',
	image_uploadtab: true,
	toolbar_location: 'bottom',
	paste_as_text: true,
	placeholder: "Tạo thảo luận mới",
	language: 'vi',
	language_url: './assets/tinymce/langs/vi.js',
	font_formats: 'Helvetica=Helvetica;UTM Avo=UTMAvo;',
	images_upload_url: environment.HOST_JEETEAM_API + '/api/topic/upload-img',
	automatic_uploads: true,
	images_upload_base_path: '/images',
	images_upload_credentials: true,
	images_upload_handler: function (blobInfo, success, failure) {
		var xhr, formData;

		xhr = new XMLHttpRequest();
		xhr.withCredentials = false;
		xhr.open('POST', environment.HOST_JEETEAM_API + '/api/topic/upload-img');

		xhr.onload = function () {
			var json;

			if (xhr.status < 200 || xhr.status >= 300) {
				failure('HTTP Error: ' + xhr.status);
				return;
			}

			json = JSON.parse(xhr.responseText);
			if (!json || typeof json.imageUrl != 'string') {
				failure('Invalid JSON: ' + xhr.responseText);
				return;
			}

			success(json.imageUrl);
		};
		formData = new FormData();
		formData.append('file', blobInfo.blob(), blobInfo.filename());

		xhr.send(formData);
	},
	init_instance_callback: function () {
		var freeTiny = document.querySelector('.tox .tox-notification--in') as HTMLInputElement;
		// freeTiny.style.display = 'none';
	},
	content_style: '.tox-notification--in{display:none};'
};
export { tinyMCE_MT }

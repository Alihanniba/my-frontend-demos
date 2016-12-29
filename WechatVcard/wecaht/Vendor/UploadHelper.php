<?php
/**
 * Created by PhpStorm.
 * User: Allan
 * Date: 7/7/15
 * Time: 3:18 PM
 */


/**
 * 上传图片Helper
 *
 * @param string    随机数
 * @param array     储存路劲
 * @param string    图片名字
 * @param array     图片宽度数组
 * @param array     图片高度数组
 * @return string   图片储存路径
 */

function UploadHelper($id,$path,$imageName,$width_size,$height_size){
            $fileLastName = rand(0,10000);
            if ($_FILES["imagename"]['error'] !== UPLOAD_ERR_OK){
                return "";
            }

            if (!is_uploaded_file($_FILES["imagename"]['tmp_name']))
                return "";

            try {
                if (!file_exists($path))
                    mkdir($path, 0777, true);

                $srcImage = new Imagick($_FILES["imagename"]['tmp_name']);

                $renamePhoto = $path.'/'.$id.'_'.$fileLastName;

                for($i=0;$i<count($width_size);$i++){
                    $image = clone $srcImage;
                    $image->setImageCompression(Imagick::COMPRESSION_JPEG);
                    $image->setImageCompressionQuality(100);
                    $image->cropThumbnailImage($width_size[$i], $height_size[$i]);
                    $image->writeImage($renamePhoto. '_' . $width_size[$i] . 'x' . $height_size[$i] . '.jpg');
                    $image->destroy();
                }

            } catch (Exception $e) {
                $apiResult['success'] = false;
                $apiResult['error_code'] = API_ERROR_FILE_CORRUPTED;
                $apiResult['error_message'] = "File corrupted.";
                return "";
            }
        return $renamePhoto;
}
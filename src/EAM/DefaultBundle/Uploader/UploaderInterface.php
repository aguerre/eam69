<?php

namespace RadioMetal\DefaultBundle\Uploader;

use Symfony\Component\HttpFoundation\File\UploadedFile;

interface UploaderInterface {

    public function upload(UploadedFile $file);
}

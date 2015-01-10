<?php 

namespace EAM\DefaultBundle\Uploader;

use Symfony\Component\HttpFoundation\File\UploadedFile;

class ImageUploader implements UploaderInterface {

    protected $container;

    public function __construct($container)
    {
        $this->container = $container;
    }

    public function upload(UploadedFile $file)
    {
        $name = $file->getClientOriginalName();

        $file->move($this->getUploadRootDir(), $name);
    }

    public function getUploadRootDir()
    {
        return $this->container->get('kernel')->getRootDir().'/../htdocs'.$this->getUploadDir();
    }

    public function getUploadDir()
    {
        return '/images/upload';
    }

}

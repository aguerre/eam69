<?php

namespace EAM\DefaultBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Image
 *
 * @ORM\Table("image")
 * @ORM\Entity(repositoryClass="EAM\DefaultBundle\Entity\ImageRepository")
 * 
 */
class Image
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="url", type="string", length=255)
     */
    private $url;

    /**
     * @var integer
     */
    private $idAlbum;

    /**
     * @var Album
     * 
     * @ORM\ManyToOne(targetEntity="EAM\DefaultBundle\Entity\Album", inversedBy="images")
     * @ORM\JoinColumn(name="idAlbum", referencedColumnName="id")
     */
    private $album;
    /**
     * @var string
     *
     * @ORM\Column(name="alt", type="string", length=255)
     */
    private $alt;

    /**
     * @var UploadedFile
     *
     * @Assert\File(maxSize="6000000")
     */
    private $file;

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set url
     *
     * @param  string $url
     * @return Image
     */
    public function setUrl($url)
    {
        $this->url = $url;

        return $this;
    }

    /**
     * Get url
     *
     * @return string
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * Set alt
     *
     * @param  string $alt
     * @return Image
     */
    public function setAlt($alt)
    {
        $this->alt = $alt;

        return $this;
    }

    /**
     * Get alt
     *
     * @return UploadedFile
     */
    public function getAlt()
    {
        return $this->alt;
    }

    /**
     * Set file
     *
     * @param  UploadedFile $file
     * @return File
     */
    public function setFile($file)
    {
        $this->file = $file;

        return $this;
    }

    /**
     * Get file
     *
     * @return 
     */
    public function getFile()
    {
        return $this->file;
    }

    /**
     * Get Album
     *
     * @return Album
     */
    public function getAlbum() {
        return $this->album;
    }
    
    /**
     * Set Album
     *
     * @param Album $album
     */
    public function setAlbum($album) {
        $this->album = $album;
    
        return $this;
    }
}

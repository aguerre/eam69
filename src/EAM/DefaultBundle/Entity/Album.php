<?php

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Album
 *
 * @ORM\Table("album")
 * @ORM\Entity(repositoryClass="RadioMetal\DefaultBundle\Entity\AlbumRepository")
 */
class Album 
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
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity="EAM\DefaultBundle\Entity\Image")
     * @ORM\JoinColumn(nullable=false)
     * )
     */
    private $images;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="integer", length=4)
     */
    private $year;

    public function getId()
    {
        return $this->id;
    }

    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    public function getName()
    {
        return $this->name;
    }

    public function addImage($image)
    {
        $this->images[] = $image;

        return $this;
    }

    public function getImages()
    {
        return $this->images;
    }
}

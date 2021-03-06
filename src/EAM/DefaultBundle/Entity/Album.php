<?php

namespace EAM\DefaultBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Album
 *
 * @ORM\Table("album")
 * @ORM\Entity(repositoryClass="EAM\DefaultBundle\Entity\AlbumRepository")
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
     * @var string
     *
     * @ORM\Column(name="categorie", type="string", length=255)
     */
    private $categorie;

    /**
     * @var DateTime
     * 
     * @ORM\Column(name="date", type="datetime")
     */
    private $date;

    /**
     * @var Doctrine\Common\Collections\Collection
     * 
     * @ORM\OneToMany(targetEntity="EAM\DefaultBundle\Entity\Image", mappedBy="album")
     */
    private $images;

    /**
     * @var string
     *
     * @ORM\Column(name="year", type="integer", length=4)
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

    public function getCategorie()
    {
        return $this->categorie;
    }

    public function setCategorie($categorie)
    {
        $this->categorie = $categorie;

        return $this;
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

    /**
     * @return integer
     */
    public function getYear() {
        return $this->year;
    }
    
    /**
     * @param integer $year
     */
    public function setYear($year) {
        $this->year = $year;
    
        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getDate() {
        return $this->date;
    }
    
    /**
     * @param \DateTime
     */
    public function setDate($date) {
        $this->date = $date;
    
        return $this;
    }
}

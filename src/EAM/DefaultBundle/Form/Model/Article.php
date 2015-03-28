<?php

namespace EAM\DefaultBundle\Form\Model;

use Symfony\Component\Validator\Constraints as Assert;

class Article
{
    /**
     * @var integer
     *
     */
    private $id;

    /**
     * @var \DateTime
     * 
     * @Assert\DateTime()
     */
    private $date;

    /**
     * @var \DateTime
     *
     */
    private $dateModif;

    /**
     * @var string
     *
     * @Assert\Length(min="8")
     */
    private $titre;

    /**
     * @var string
     *
     * @Assert\NotBlank
     */
    private $contenu;

    /**
     */
    private $publication;

    /**
     *
     * @Assert\Valid()
     */
    private $image;

    public function __construct()
    {
        $this->dateModif = new \Datetime(); // Par défaut, la date de l'article est la date d'aujourd'hui
        $this->publication = true;
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Set date
     *
     * @param  \DateTime $date
     * @return Article
     */
    public function setDate($date)
    {
        $this->date = $date;

        return $this;
    }

    /**
     * Get date
     *
     * @return \DateTime
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * Set dateModif
     *
     * @param  \DateTime $dateModif
     * @return Article
     */
    public function setDateModif($dateModif)
    {
        $this->dateModif = $dateModif;

        return $this;
    }

    /**
     * Get dateModif
     *
     * @return \DateTime
     */
    public function getDateModif()
    {
        return $this->dateModif;
    }

    /**
     * Set titre
     *
     * @param  string  $titre
     * @return Article
     */
    public function setTitre($titre)
    {
        $this->titre = $titre;

        return $this;
    }

    /**
     * Get titre
     *
     * @return string
     */
    public function getTitre()
    {
        return $this->titre;
    }

    /**
     * Set contenu
     *
     * @param  string  $contenu
     * @return Article
     */
    public function setContenu($contenu)
    {
        $this->contenu = $contenu;

        return $this;
    }

    /**
     * Get contenu
     *
     * @return string
     */
    public function getContenu()
    {
        return $this->contenu;
    }

    /**
     * Set publication
     *
     * @param  boolean $publication
     * @return Article
     */
    public function setPublication($publication)
    {
        $this->publication = $publication;

        return $this;
    }

    /**
     * Get publication
     *
     * @return boolean
     */
    public function getPublication()
    {
        return $this->publication;
    }

    /**
     * Set image
     *
     * @param  \RadioMetal\DefaultBundle\Entity\Image $image
     * @return Article
     */
    public function setImage(\RadioMetal\DefaultBundle\Entity\Image $image = null)
    {
        $this->image = $image;

        return $this;
    }

    /**
     * Get image
     *
     * @return \RadioMetal\DefaultBundle\Entity\Image
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     */
    public function updateDate()
    {
        $this->setDateModif(new \DateTime());
    }
}

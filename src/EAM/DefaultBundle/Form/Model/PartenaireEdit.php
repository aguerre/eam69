<?php

namespace EAM\DefaultBundle\Form\Model;

class PartenaireEdit {
    protected $id;
    
    protected $nom;

    protected $image;

    public function getNom()
    {
        return $this->nom;
    }

    public function setNom($nom)
    {
        $this->nom = $nom;

        return $this;
    }

    public function getImage()
    {
        return $this->image;
    }

    public function setImage($image)
    {
        $this->image = $image;
    }
}

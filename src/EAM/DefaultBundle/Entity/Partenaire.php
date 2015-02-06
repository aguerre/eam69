<?php

namespace EAM\DefaultBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Partner
 *
 * @ORM\Table("partenaire") 
 * @ORM\Entity(repositoryClass="EAM\DefaultBundle\Entity\PartenaireRepository")
 */
class Partenaire 
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
	 * @ORM\Column(name="nom", type="string")
	 */
	private $nom;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="image", type="string")
	 */
	private $image;

	public function getId()
	{
		return $this->id;
	}

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

		return $this;
	}
}

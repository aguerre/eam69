<?php

namespace EAM\DefaultBundle\Form\Model;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * Contact
 */
class Contact
{
    /**
     * Nom
     * @var string
     * @Assert\NotBlank(message="Veuillez renseigner votre nom")
     */
    protected $nom;


    /**
     * Email
     * @var string
     * @Assert\NotBlank(message="Veuillez renseigner votre email")
     * @Assert\Email(message="Votre email est invalide")
     */
    protected $email;

    /**
     * Sujet
     * @var string
     * @Assert\NotBlank(message="Veuillez spécifier un sujet")
     */
    protected $sujet;

    /**
     * Message
     * @var string
     * @Assert\NotBlank(message="Veuillez renseigner un message")
     * @Assert\Length(
     *     min=20,
     *     minMessage="Votre message doit faire au moins {{ limit }} caractères"
     * )
     */
    protected $message;

    /**
     * Get Nom
     *
     * @return string
     */
    public function getNom()
    {
        return $this->nom;
    }

    /**
     * Set Nom
     *
     * @param string $nom A new nom
     *
     * @return Contact
     */
    public function setNom($nom)
    {
        $this->nom = $nom;

        return $this;
    }

    /**
     * Get Email
     *
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set Email
     *
     * @param string $email A new email
     *
     * @return Contact
     */
    public function setEmail($email)
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Get Sujet
     *
     * @return string
     */
    public function getSujet()
    {
        return $this->sujet;
    }
    
    /**
     * Set Sujet
     *
     * @param string $sujet
     *
     * @return Contact
     */
    public function setSujet($sujet)
    {
        $this->sujet = $sujet;
    
        return $this;
    }

    /**
     * Get Message
     *
     * @return string
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * Set Message
     *
     * @param string $message A new message
     *
     * @return Contact
     */
    public function setMessage($message)
    {
        $this->message = $message;

        return $this;
    }
}

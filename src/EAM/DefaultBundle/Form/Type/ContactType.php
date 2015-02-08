<?php

namespace EAM\DefaultBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

/**
 * Contact type
 */
class ContactType extends AbstractType
{
    /**
     * {@inheritDoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('nom', 'text', array(
                    'required' => true,
                    'attr' => array(
                        'placeholder' => 'Nom*'
                    )
                )
            )
            ->add('email', 'text', array(
                    'required' => true,
                    'attr' => array(
                        'placeholder' => 'Email*'
                    )
                )
            )
            ->add('sujet', 'text', array(
                    'required' => true,
                    'attr' => array(
                        'placeholder' => 'Sujet*',
                    )
                )
            )
            ->add('message', 'textarea', array(
                    'required' => true,
                    'attr' => array(
                        'placeholder' => 'Message*'
                    )
                )
            )
        ;
    }

    /**
     * {@inheritDoc}
     */
    public function getName()
    {
        return 'contact';
    }
}
